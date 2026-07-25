package com.artesaniaschigorodo.application.adapters.persistence.sql.mappers;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.SavedPaymentMethodEntity;
import com.artesaniaschigorodo.domain.models.enums.PaymentMethod;
import com.artesaniaschigorodo.domain.models.user.SavedPaymentMethod;

public class SavedPaymentMethodMapper {

    public static SavedPaymentMethodEntity toEntity(SavedPaymentMethod domain) {
        if (domain == null) return null;
        return SavedPaymentMethodEntity.builder()
                .id(domain.getId())
                .userId(domain.getUserId())
                .cardType(domain.getCardType() != null ? domain.getCardType().name() : null)
                .cardNumber(domain.getCardNumber())
                .cardHolderName(domain.getCardHolderName())
                .expiryDate(domain.getExpiryDate())
                .cvv(domain.getCvv())
                .isDefault(domain.isDefault())
                .lastFourDigits(domain.getLastFourDigits())
                .build();
    }

    public static SavedPaymentMethod toDomain(SavedPaymentMethodEntity entity) {
        if (entity == null) return null;
        return SavedPaymentMethod.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .cardType(entity.getCardType() != null ? PaymentMethod.valueOf(entity.getCardType()) : null)
                .cardNumber(entity.getCardNumber())
                .cardHolderName(entity.getCardHolderName())
                .expiryDate(entity.getExpiryDate())
                .cvv(entity.getCvv())
                .isDefault(entity.isDefault())
                .lastFourDigits(entity.getLastFourDigits())
                .build();
    }
}
