package com.artesaniaschigorodo.application.adapters.persistence.sql.mappers;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.OrderEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.OrderItemEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.ProductEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.UserEntity;
import com.artesaniaschigorodo.domain.models.order.Order;
import com.artesaniaschigorodo.domain.models.order.OrderItem;
import com.artesaniaschigorodo.domain.models.order.ShippingDetails;
import com.artesaniaschigorodo.domain.models.payment.PaymentDetails;
import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.models.enums.OrderStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class OrderMapper {

    public static OrderEntity toEntity(Order domain) {
        if (domain == null) return null;

        List<OrderItemEntity> itemEntities = new ArrayList<>();
        if (domain.getItems() != null) {
            itemEntities = domain.getItems().stream()
                    .map(OrderMapper::toItemEntity)
                    .collect(Collectors.toList());
        }

        OrderEntity entity = OrderEntity.builder()
                .id(domain.getId())
                .orderNumber(domain.getOrderNumber())
                .user(UserMapper.toEntity(domain.getUser()))
                .items(itemEntities)
                .subtotal(domain.getSubtotal())
                .shippingCost(domain.getShippingCost())
                .total(domain.getTotal())
                .orderStatus(domain.getOrderStatus() != null ? domain.getOrderStatus().name() : null)
                .createdAt(domain.getCreatedAt())
                .build();

        if (domain.getShippingDetails() != null) {
            ShippingDetails sd = domain.getShippingDetails();
            entity.setCountry(sd.getCountry());
            entity.setDepartment(sd.getDepartment());
            entity.setCity(sd.getCity());
            entity.setAddress(sd.getAddress());
            entity.setPostalCode(sd.getPostalCode());
            entity.setShippingMethod(sd.getShippingMethod());
        }

        if (domain.getPaymentDetails() != null) {
            PaymentDetails pd = domain.getPaymentDetails();
            entity.setPaymentMethod(pd.getPaymentMethod());
            entity.setPaymentTransactionId(pd.getTransactionId());
            entity.setPaymentStatus(pd.getStatus());
        }

        return entity;
    }

    public static Order toDomain(OrderEntity entity) {
        if (entity == null) return null;

        List<OrderItem> items = new ArrayList<>();
        if (entity.getItems() != null) {
            items = entity.getItems().stream()
                    .map(OrderMapper::toItemDomain)
                    .collect(Collectors.toList());
        }

        ShippingDetails shipping = ShippingDetails.builder()
                .country(entity.getCountry())
                .department(entity.getDepartment())
                .city(entity.getCity())
                .address(entity.getAddress())
                .postalCode(entity.getPostalCode())
                .shippingMethod(entity.getShippingMethod())
                .build();

        PaymentDetails payment = PaymentDetails.builder()
                .paymentMethod(entity.getPaymentMethod())
                .transactionId(entity.getPaymentTransactionId())
                .status(entity.getPaymentStatus())
                .build();

        return Order.builder()
                .id(entity.getId())
                .orderNumber(entity.getOrderNumber())
                .user(UserMapper.toDomain(entity.getUser()))
                .items(items)
                .subtotal(entity.getSubtotal())
                .shippingCost(entity.getShippingCost())
                .total(entity.getTotal())
                .shippingDetails(shipping)
                .paymentDetails(payment)
                .orderStatus(entity.getOrderStatus() != null ? OrderStatus.valueOf(entity.getOrderStatus()) : null)
                .createdAt(entity.getCreatedAt())
                .build();
    }

    private static OrderItemEntity toItemEntity(OrderItem item) {
        if (item == null) return null;
        return OrderItemEntity.builder()
                .product(ProductEntity.builder()
                        .id(item.getProduct().getId())
                        .name(item.getProduct().getName())
                        .sellerId(item.getProduct().getSellerId())
                        .sellerName(item.getProduct().getSellerName())
                        .price(item.getProduct().getPrice())
                        .build())
                .productName(item.getProduct().getName())
                .seller(UserEntity.builder()
                        .id(item.getProduct().getSellerId())
                        .build())
                .sellerName(item.getProduct().getSellerName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(item.getSubtotal())
                .build();
    }

    private static OrderItem toItemDomain(OrderItemEntity entity) {
        if (entity == null) return null;
        return OrderItem.builder()
                .product(Product.builder()
                        .id(entity.getProduct().getId())
                        .name(entity.getProductName())
                        .sellerId(entity.getSeller().getId())
                        .sellerName(entity.getSellerName())
                        .price(entity.getUnitPrice())
                        .build())
                .quantity(entity.getQuantity())
                .unitPrice(entity.getUnitPrice())
                .subtotal(entity.getSubtotal())
                .build();
    }
}

