package com.artesaniaschigorodo.application.adapters.persistence.sql.mappers;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.SavedPaymentMethodEntity;
import com.artesaniaschigorodo.domain.models.user.SavedPaymentMethod;

public class SavedPaymentMethodMapper {

    public static SavedPaymentMethodEntity toEntity(SavedPaymentMethod domain) {
        if (domain == null) return null;
        return SavedPaymentMethodEntity.builder()
                .id(domain.getId())
                .userId(domain.getUserId())
                .cardType(domain.getCardType())
                .cardNumber(domain.getCardNumber())
                .cardHolderName(domain.getCardHolderName())
                .expiryDate(domain.getExpiryDate())
                .cvv(domain.getCvv())
                .isDefault(domain.isDefault())
                .lastFourDigits(domain.getCardNumber() != null && domain.getCardNumber().length() >= 4 ? domain.getCardNumber().substring(domain.getCardNumber().length() - 4) : "****")
                .build();
    }

    public static SavedPaymentMethod toDomain(SavedPaymentMethodEntity entity) {
        if (entity == null) return null;
        return SavedPaymentMethod.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .cardType(entity.getCardType())
                .cardNumber(entity.getCardNumber())
                .cardHolderName(entity.getCardHolderName())
                .expiryDate(entity.getExpiryDate())
                .cvv(entity.getCvv())
                .isDefault(entity.isDefault())
                .build();
    }
}
