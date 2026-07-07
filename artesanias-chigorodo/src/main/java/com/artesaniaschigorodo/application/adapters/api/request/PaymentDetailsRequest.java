package com.artesaniaschigorodo.application.adapters.api.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PaymentDetailsRequest {

    @NotBlank(message = "El método de pago es obligatorio.")
    private String paymentMethod; // PSE, CREDIT_CARD, MERCADO_PAGO, NEQUI, DAVIPLATA

    private String transactionId;

    private String status; // APPROVED, PENDING, FAILED
}
