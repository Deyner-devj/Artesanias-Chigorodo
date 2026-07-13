package com.artesaniaschigorodo.application.adapters.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

	private String orderNumber;
	private String paymentMethod;
	private String transactionId;
	private String status;
	private Double amount;
	private String userEmail;
	private LocalDateTime processedAt;
}
