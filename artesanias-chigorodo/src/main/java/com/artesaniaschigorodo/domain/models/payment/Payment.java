package com.artesaniaschigorodo.domain.models.payment;

import com.artesaniaschigorodo.domain.models.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

	private Long id;
	private String orderNumber;
	private String userEmail;
	private PaymentMethod paymentMethod;
	private String transactionId;
	private String status;
	private Double amount;
	private LocalDateTime processedAt;
}
