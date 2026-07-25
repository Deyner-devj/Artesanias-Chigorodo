package com.artesaniaschigorodo.application.adapters.api.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {
    @NotBlank
    private String orderNumber;

    @NotBlank
    private String paymentMethod;

    @NotBlank
    private String status;

    @NotBlank
    private String transactionId;

    @NotNull
    private Double amount;

    @NotBlank
    private String userEmail;
}