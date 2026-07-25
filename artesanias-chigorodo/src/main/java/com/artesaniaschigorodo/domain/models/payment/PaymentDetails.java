package com.artesaniaschigorodo.domain.models.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDetails {
    private String paymentMethod;
    private String transactionId;
    private String status;
    private Double amount;
    private String userEmail;
    private LocalDateTime processedAt;
}