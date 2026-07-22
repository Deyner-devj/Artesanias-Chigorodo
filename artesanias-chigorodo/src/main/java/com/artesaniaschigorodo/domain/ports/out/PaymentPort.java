package com.artesaniaschigorodo.domain.ports.out;

import com.artesaniaschigorodo.domain.models.payment.Payment;

import java.util.Optional;

public interface PaymentPort {
    Payment save(Payment payment);
    Optional<Payment> findByTransactionId(String transactionId);
    Optional<Payment> findByOrderNumber(String orderNumber);
}
