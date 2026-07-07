package com.artesaniaschigorodo.application.adapters.persistence.sql.mappers;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.OrderEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.OrderItemEntity;
import com.artesaniaschigorodo.domain.models.Order;
import com.artesaniaschigorodo.domain.models.OrderItem;
import com.artesaniaschigorodo.domain.models.PaymentDetails;
import com.artesaniaschigorodo.domain.models.ShippingDetails;
import com.artesaniaschigorodo.domain.models.enums.OrderStatus;
import com.artesaniaschigorodo.domain.models.enums.PaymentMethod;
import com.artesaniaschigorodo.domain.models.enums.ShippingMethod;

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
            entity.setShippingMethod(sd.getShippingMethod() != null ? sd.getShippingMethod().name() : null);
        }

        if (domain.getPaymentDetails() != null) {
            PaymentDetails pd = domain.getPaymentDetails();
            entity.setPaymentMethod(pd.getPaymentMethod() != null ? pd.getPaymentMethod().name() : null);
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
                .shippingMethod(entity.getShippingMethod() != null ? ShippingMethod.valueOf(entity.getShippingMethod()) : null)
                .build();

        PaymentDetails payment = PaymentDetails.builder()
                .paymentMethod(entity.getPaymentMethod() != null ? PaymentMethod.valueOf(entity.getPaymentMethod()) : null)
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
                .product(ProductMapper.toEntity(item.getProduct()))
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(item.getSubtotal())
                .build();
    }

    private static OrderItem toItemDomain(OrderItemEntity entity) {
        if (entity == null) return null;
        return OrderItem.builder()
                .product(ProductMapper.toDomain(entity.getProduct()))
                .quantity(entity.getQuantity())
                .unitPrice(entity.getUnitPrice())
                .subtotal(entity.getSubtotal())
                .build();
    }
}
