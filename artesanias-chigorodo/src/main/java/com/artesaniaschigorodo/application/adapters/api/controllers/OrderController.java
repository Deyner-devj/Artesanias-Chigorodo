package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.request.OrderRequest;
import com.artesaniaschigorodo.application.adapters.api.response.OrderResponse;
import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.order.Order;
import com.artesaniaschigorodo.domain.models.order.OrderItem;
import com.artesaniaschigorodo.domain.models.order.ShippingDetails;
import com.artesaniaschigorodo.domain.models.payment.PaymentDetails;
import com.artesaniaschigorodo.domain.models.order.Invoice;
import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.models.enums.PaymentMethod;
import com.artesaniaschigorodo.domain.models.enums.ShippingMethod;
import com.artesaniaschigorodo.domain.ports.in.OrderPort;
import com.artesaniaschigorodo.domain.ports.out.InvoicePort;
import com.artesaniaschigorodo.domain.models.order.Invoice;
import com.artesaniaschigorodo.domain.ports.out.UserPort;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderPort orderUseCase;
    private final UserPort userPersistencePort;
    private final InvoicePort invoicePersistencePort;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest request) {
        User currentUser = getCurrentUser();
        Order order = mapToDomain(request);
        Order created = orderUseCase.createOrder(order, currentUser);
        return ResponseEntity.ok(mapToResponse(created));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders() {
        User currentUser = getCurrentUser();
        List<OrderResponse> responses = orderUseCase.getOrdersForUser(currentUser).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<OrderResponse> getOrderByOrderNumber(@PathVariable String orderNumber) {
        User currentUser = getCurrentUser();
        Order order = orderUseCase.getOrderByOrderNumber(orderNumber, currentUser);
        return ResponseEntity.ok(mapToResponse(order));
    }

    @PatchMapping("/{orderNumber}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable String orderNumber,
            @RequestBody Map<String, String> body
    ) {
        User currentUser = getCurrentUser();
        String status = body.get("status");
        Order updated = orderUseCase.updateOrderStatus(orderNumber, status, currentUser);
        return ResponseEntity.ok(mapToResponse(updated));
    }

    @GetMapping("/{orderNumber}/invoice")
    public ResponseEntity<Invoice> getInvoiceByOrderNumber(@PathVariable String orderNumber) {
        User currentUser = getCurrentUser();
        // This will run the ownership validation check automatically
        orderUseCase.getOrderByOrderNumber(orderNumber, currentUser);
        
        Invoice invoice = invoicePersistencePort.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Factura electrónica no encontrada para la orden: " + orderNumber));
        return ResponseEntity.ok(invoice);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ForbiddenOperationException("Debe iniciar sesión para realizar esta operación.");
        }
        String email = authentication.getName();
        return userPersistencePort.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario actual no encontrado en el sistema."));
    }

    private Order mapToDomain(OrderRequest request) {
        List<OrderItem> items = request.getItems().stream()
                .map(itemReq -> OrderItem.builder()
                        .product(Product.builder().id(itemReq.getProductId()).build())
                        .quantity(itemReq.getQuantity())
                        .build())
                .collect(Collectors.toList());

        ShippingDetails shipping = ShippingDetails.builder()
                .country(request.getShippingDetails().getCountry())
                .department(request.getShippingDetails().getDepartment())
                .city(request.getShippingDetails().getCity())
                .address(request.getShippingDetails().getAddress())
                .postalCode(request.getShippingDetails().getPostalCode())
                .shippingMethod(ShippingMethod.valueOf(request.getShippingDetails().getShippingMethod().toUpperCase()))
                .build();

        PaymentDetails payment = PaymentDetails.builder()
                .paymentMethod(PaymentMethod.valueOf(request.getPaymentDetails().getPaymentMethod().toUpperCase()))
                .transactionId(request.getPaymentDetails().getTransactionId())
                .status(request.getPaymentDetails().getStatus())
                .build();

        return Order.builder()
                .items(items)
                .shippingDetails(shipping)
                .paymentDetails(payment)
                .build();
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderResponse.OrderItemResponse> items = order.getItems().stream()
                .map(item -> OrderResponse.OrderItemResponse.builder()
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .subtotal(item.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        OrderResponse.ShippingDetailsResponse shipping = OrderResponse.ShippingDetailsResponse.builder()
                .country(order.getShippingDetails().getCountry())
                .department(order.getShippingDetails().getDepartment())
                .city(order.getShippingDetails().getCity())
                .address(order.getShippingDetails().getAddress())
                .postalCode(order.getShippingDetails().getPostalCode())
                .shippingMethod(order.getShippingDetails().getShippingMethod().name())
                .build();

        OrderResponse.PaymentDetailsResponse payment = OrderResponse.PaymentDetailsResponse.builder()
                .paymentMethod(order.getPaymentDetails().getPaymentMethod().name())
                .transactionId(order.getPaymentDetails().getTransactionId())
                .status(order.getPaymentDetails().getStatus())
                .build();

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .userEmail(order.getUser().getEmail())
                .userFullName(order.getUser().getFullName())
                .items(items)
                .subtotal(order.getSubtotal())
                .shippingCost(order.getShippingCost())
                .total(order.getTotal())
                .shippingDetails(shipping)
                .paymentDetails(payment)
                .orderStatus(order.getOrderStatus().name())
                .createdAt(order.getCreatedAt())
                .build();
    }
}

