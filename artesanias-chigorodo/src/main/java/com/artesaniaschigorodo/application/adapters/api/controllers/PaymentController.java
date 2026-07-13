package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.request.PaymentRequest;
import com.artesaniaschigorodo.application.adapters.api.response.PaymentResponse;
import com.artesaniaschigorodo.application.useCases.ProcessPaymentUseCase;
import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.payment.Payment;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.out.UserPortOut;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

	private final ProcessPaymentUseCase processPaymentUseCase;
	private final UserPortOut userPersistencePort;

	@PostMapping
	public ResponseEntity<PaymentResponse> processPayment(@Valid @RequestBody PaymentRequest request) {
		Payment payment = processPaymentUseCase.processPayment(request, getCurrentUser());
		return ResponseEntity.ok(mapToResponse(payment));
	}

	private User getCurrentUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			throw new ForbiddenOperationException("Debe iniciar sesión para procesar pagos.");
		}
		return userPersistencePort.findByEmail(authentication.getName())
				.orElseThrow(() -> new ResourceNotFoundException("Usuario actual no encontrado en el sistema."));
	}

	private PaymentResponse mapToResponse(Payment payment) {
		return PaymentResponse.builder()
				.orderNumber(payment.getOrderNumber())
				.paymentMethod(payment.getPaymentMethod() != null ? payment.getPaymentMethod().name() : null)
				.transactionId(payment.getTransactionId())
				.status(payment.getStatus())
				.amount(payment.getAmount())
				.userEmail(payment.getUserEmail())
				.processedAt(payment.getProcessedAt())
				.build();
	}
}
