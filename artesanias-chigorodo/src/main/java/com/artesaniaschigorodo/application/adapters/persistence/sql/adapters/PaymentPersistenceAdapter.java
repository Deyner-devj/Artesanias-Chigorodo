package com.artesaniaschigorodo.application.adapters.persistence.sql.adapters;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.PaymentEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.mappers.PaymentMapper;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.PaymentRepository;
import com.artesaniaschigorodo.domain.models.payment.Payment;
import com.artesaniaschigorodo.domain.ports.out.PaymentPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PaymentPersistenceAdapter implements PaymentPort {

    private final PaymentRepository paymentRepository;

    @Override
    public Payment save(Payment payment) {
        PaymentEntity entity = PaymentMapper.toEntity(payment);
        PaymentEntity saved = paymentRepository.save(entity);
        return PaymentMapper.toDomain(saved);
    }

    @Override
    public Optional<Payment> findByTransactionId(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId).map(PaymentMapper::toDomain);
    }

    @Override
    public Optional<Payment> findByOrderNumber(String orderNumber) {
        return paymentRepository.findByOrderNumber(orderNumber).map(PaymentMapper::toDomain);
    }
}
