package com.artesaniaschigorodo.application.useCases;

import com.artesaniaschigorodo.domain.exceptions.BusinessException;
import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.order.Order;
import com.artesaniaschigorodo.domain.models.order.OrderItem;
import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.models.enums.OrderStatus;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.ports.in.OrderPort;
import com.artesaniaschigorodo.domain.models.order.Invoice;
import com.artesaniaschigorodo.domain.ports.out.ElectronicInvoicingPort;
import com.artesaniaschigorodo.domain.ports.out.InvoicePort;
import com.artesaniaschigorodo.domain.ports.out.ProductPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OrderUseCase implements OrderPort {

    private final com.artesaniaschigorodo.domain.ports.out.OrderPort orderPersistencePort;
    private final ProductPort productPersistencePort;
    private final ElectronicInvoicingPort electronicInvoicingPort;
    private final InvoicePort invoicePersistencePort;
    private final Random random = new Random();

    @Override
    @Transactional
    public Order createOrder(Order order, User currentUser) {
        new com.artesaniaschigorodo.domain.services.CreateOrder().validateAndCalculate(order);

        order.setUser(currentUser);
        order.setCreatedAt(LocalDateTime.now());
        
        // Generate Order Number: #AC-YYYY-XXXXXX
        int year = LocalDateTime.now().getYear();
        int randomCode = 100000 + random.nextInt(900000); // 6-digit random number
        order.setOrderNumber("AC-" + year + "-" + randomCode);

        double subtotal = 0.0;

        // Verify and reserve stock, calculate prices
        for (OrderItem item : order.getItems()) {
            Product product = productPersistencePort.findByIdForUpdate(item.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("El producto con ID " + item.getProduct().getId() + " no existe."));

            if (product.getStock() < item.getQuantity()) {
                throw new BusinessException("Stock insuficiente para el producto: " + product.getName() + ". Stock disponible: " + product.getStock());
            }

            // Deduct stock
            product.setStock(product.getStock() - item.getQuantity());
            productPersistencePort.save(product);

            // Populate item details
            item.setProduct(product);
            item.setUnitPrice(product.getPrice());
            item.setSubtotal(product.getPrice() * item.getQuantity());
            subtotal += item.getSubtotal();
        }

        order.setSubtotal(subtotal);

        // Calculate shipping cost based on method
        double shippingCost = 0.0;
        if (order.getShippingDetails() != null && order.getShippingDetails().getShippingMethod() != null) {
            switch (order.getShippingDetails().getShippingMethod()) {
                case EXPRESS:
                    shippingCost = 25000.0;
                    break;
                case STANDARD:
                    shippingCost = 15000.0;
                    break;
                case PICKUP:
                default:
                    shippingCost = 0.0;
                    break;
            }
        }
        order.setShippingCost(shippingCost);
        order.setTotal(subtotal + shippingCost);

        // Payment status
        if (order.getPaymentDetails() != null && "APPROVED".equalsIgnoreCase(order.getPaymentDetails().getStatus())) {
            order.setOrderStatus(OrderStatus.PAID);
        } else {
            order.setOrderStatus(OrderStatus.PENDING);
        }

        Order savedOrder = orderPersistencePort.save(order);
        if (savedOrder.getOrderStatus() == OrderStatus.PAID) {
            try {
                Invoice invoice = electronicInvoicingPort.submitInvoice(savedOrder);
                invoicePersistencePort.save(invoice);
            } catch (Exception e) {
                System.err.println("Error generating electronic invoice: " + e.getMessage());
            }
        }
        return savedOrder;
    }

    @Override
    public Order getOrderByOrderNumber(String orderNumber, User currentUser) {
        Order order = orderPersistencePort.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("La orden no existe."));

        if (currentUser.getRole() == Role.CLIENT) {
            if (!order.getUser().getId().equals(currentUser.getId())) {
                throw new ForbiddenOperationException("No tiene permisos para ver esta orden.");
            }
        } else if (currentUser.getRole() == Role.VENDOR) {
            boolean ownsItem = order.getItems().stream()
                    .anyMatch(item -> item.getProduct().getSellerName().equalsIgnoreCase(currentUser.getFullName()));
            if (!ownsItem) {
                throw new ForbiddenOperationException("No tiene permisos para ver esta orden.");
            }
            // Strip items that do not belong to this vendor
            List<OrderItem> vendorItems = order.getItems().stream()
                    .filter(item -> item.getProduct().getSellerName().equalsIgnoreCase(currentUser.getFullName()))
                    .collect(java.util.stream.Collectors.toList());
            order.setItems(vendorItems);
        }

        return order;
    }

    @Override
    public List<Order> getOrdersForUser(User currentUser) {
        if (currentUser.getRole() == Role.CLIENT) {
            return orderPersistencePort.findByUserId(currentUser.getId());
        }
        
        List<Order> allOrders = orderPersistencePort.findByUserId(null);
        if (currentUser.getRole() == Role.VENDOR) {
            return allOrders.stream()
                    .filter(order -> order.getItems().stream()
                            .anyMatch(item -> item.getProduct().getSellerName().equalsIgnoreCase(currentUser.getFullName())))
                    .map(order -> {
                        // Clone/filter items to prevent cross-vendor info leak
                        List<OrderItem> vendorItems = order.getItems().stream()
                                .filter(item -> item.getProduct().getSellerName().equalsIgnoreCase(currentUser.getFullName()))
                                .collect(java.util.stream.Collectors.toList());
                        order.setItems(vendorItems);
                        return order;
                    })
                    .collect(java.util.stream.Collectors.toList());
        }
        
        return allOrders;
    }

    @Override
    @Transactional
    public Order updateOrderStatus(String orderNumber, String status, User currentUser) {
        if (currentUser.getRole() != Role.ADMIN && currentUser.getRole() != Role.VENDOR) {
            throw new ForbiddenOperationException("No tiene permisos para modificar el estado de las órdenes.");
        }

        Order order = orderPersistencePort.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("La orden no existe."));

        if (currentUser.getRole() == Role.VENDOR) {
            boolean ownsItem = order.getItems().stream()
                    .anyMatch(item -> item.getProduct().getSellerName().equalsIgnoreCase(currentUser.getFullName()));
            if (!ownsItem) {
                throw new ForbiddenOperationException("No tiene permisos para modificar el estado de esta orden.");
            }
        }

        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(status.toUpperCase());
            order.setOrderStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Estado de orden inválido: " + status);
        }

        Order savedOrder = orderPersistencePort.save(order);
        if (newStatus == OrderStatus.PAID && invoicePersistencePort.findByOrderNumber(order.getOrderNumber()).isEmpty()) {
            try {
                Invoice invoice = electronicInvoicingPort.submitInvoice(savedOrder);
                invoicePersistencePort.save(invoice);
            } catch (Exception e) {
                System.err.println("Error generating electronic invoice on status update: " + e.getMessage());
            }
        }
        return savedOrder;
    }
}

