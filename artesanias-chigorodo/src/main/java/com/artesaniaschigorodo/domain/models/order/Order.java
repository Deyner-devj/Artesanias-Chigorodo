package com.artesaniaschigorodo.domain.models.order;

import com.artesaniaschigorodo.domain.models.enums.OrderStatus;
import com.artesaniaschigorodo.domain.models.payment.PaymentDetails;
import com.artesaniaschigorodo.domain.models.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    private Long id;
    private String orderNumber;
    private User user;
    private List<OrderItem> items;
    private Double subtotal;
    private Double totalAmount;
    private Double shippingCost;
    private Double total;
    private ShippingDetails shippingDetails;
    private PaymentDetails paymentDetails;
    private OrderStatus orderStatus;
    private LocalDateTime createdAt;
}