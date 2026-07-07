package com.artesaniaschigorodo.application.adapters.api.response;

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
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private String userEmail;
    private String userFullName;
    private List<OrderItemResponse> items;
    private Double subtotal;
    private Double shippingCost;
    private Double total;
    private ShippingDetailsResponse shippingDetails;
    private PaymentDetailsResponse paymentDetails;
    private String orderStatus;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponse {
        private Long productId;
        private String productName;
        private Integer quantity;
        private Double unitPrice;
        private Double subtotal;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShippingDetailsResponse {
        private String country;
        private String department;
        private String city;
        private String address;
        private String postalCode;
        private String shippingMethod;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentDetailsResponse {
        private String paymentMethod;
        private String transactionId;
        private String status;
    }
}

