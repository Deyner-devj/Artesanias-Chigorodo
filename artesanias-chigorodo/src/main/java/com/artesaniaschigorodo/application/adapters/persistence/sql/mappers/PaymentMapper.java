package com.artesaniaschigorodo.application.adapters.persistence.sql.mappers;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.PaymentEntity;
import com.artesaniaschigorodo.domain.models.payment.Payment;

public class PaymentMapper {

    public static PaymentEntity toEntity(Payment domain) {
        if (domain == null) {
            return null;
        }
        return PaymentEntity.builder()
                .id(domain.getId())
                .orderNumber(domain.getOrderNumber())
                .userEmail(domain.getUserEmail())
                .paymentMethod(domain.getPaymentMethod() != null ? domain.getPaymentMethod().name() : null)
                .transactionId(domain.getTransactionId())
                .status(domain.getStatus())
                .amount(domain.getAmount())
                .processedAt(domain.getProcessedAt())
                .build();
    }

    public static Payment toDomain(PaymentEntity entity) {
        if (entity == null) {
            return null;
        }
        return Payment.builder()
                .id(entity.getId())
                .orderNumber(entity.getOrderNumber())
                .userEmail(entity.getUserEmail())
                .paymentMethod(entity.getPaymentMethod() != null ? com.artesaniaschigorodo.domain.models.enums.PaymentMethod.valueOf(entity.getPaymentMethod()) : null)
                .transactionId(entity.getTransactionId())
                .status(entity.getStatus())
                .amount(entity.getAmount())
                .processedAt(entity.getProcessedAt())
                .build();
    }
}
