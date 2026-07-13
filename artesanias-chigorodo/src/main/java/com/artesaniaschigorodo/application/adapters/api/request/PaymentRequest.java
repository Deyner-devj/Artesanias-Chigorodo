package com.artesaniaschigorodo.application.adapters.api.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PaymentRequest {

	@NotBlank(message = "El número de la orden es obligatorio.")
	private String orderNumber;

	@NotBlank(message = "El método de pago es obligatorio.")
	private String paymentMethod;

	private String transactionId;

	private String status;
}
