package com.artesaniaschigorodo.application.adapters.persistence.sql.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    private List<OrderItemEntity> items;

    @Column(nullable = false)
    private Double subtotal;

    @Column(name = "shipping_cost", nullable = false)
    private Double shippingCost;

    @Column(nullable = false)
    private Double total;

    private String country;
    private String department;
    private String city;
    private String address;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "shipping_method")
    private String shippingMethod;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "payment_transaction_id")
    private String paymentTransactionId;

    @Column(name = "payment_status")
    private String paymentStatus;

    @Column(name = "order_status", nullable = false)
    private String orderStatus;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
