package com.artesaniaschigorodo.application.adapters.persistence.sql.mappers;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.WithdrawalEntity;
import com.artesaniaschigorodo.domain.models.financial.Withdrawal;

import java.util.List;
import java.util.stream.Collectors;

public class WithdrawalMapper {

    public static WithdrawalEntity toEntity(Withdrawal domain) {
        if (domain == null) return null;
        
        return WithdrawalEntity.builder()
                .id(domain.getId())
                .artisanId(domain.getArtisanId())
                .artisanName(domain.getArtisanName())
                .bankName(domain.getBankName())
                .accountNumber(domain.getAccountNumber())
                .accountType(domain.getAccountType())
                .amount(domain.getAmount())
                .platformCommission(domain.getPlatformCommission())
                .netAmount(domain.getNetAmount())
                .status(domain.getStatus() != null ? 
                    WithdrawalEntity.WithdrawalStatus.valueOf(domain.getStatus().name()) : 
                    WithdrawalEntity.WithdrawalStatus.PENDING)
                .transactionReference(domain.getTransactionReference())
                .requestedAt(domain.getRequestedAt())
                .processedAt(domain.getProcessedAt())
                .notes(domain.getNotes())
                .build();
    }

    public static Withdrawal toDomain(WithdrawalEntity entity) {
        if (entity == null) return null;
        
        return Withdrawal.builder()
                .id(entity.getId())
                .artisanId(entity.getArtisanId())
                .artisanName(entity.getArtisanName())
                .bankName(entity.getBankName())
                .accountNumber(entity.getAccountNumber())
                .accountType(entity.getAccountType())
                .amount(entity.getAmount())
                .platformCommission(entity.getPlatformCommission())
                .netAmount(entity.getNetAmount())
                .status(entity.getStatus() != null ? 
                    Withdrawal.WithdrawalStatus.valueOf(entity.getStatus().name()) : 
                    Withdrawal.WithdrawalStatus.PENDING)
                .transactionReference(entity.getTransactionReference())
                .requestedAt(entity.getRequestedAt())
                .processedAt(entity.getProcessedAt())
                .notes(entity.getNotes())
                .build();
    }

    public static List<Withdrawal> toDomainList(List<WithdrawalEntity> entities) {
        if (entities == null) return List.of();
        return entities.stream()
                .map(WithdrawalMapper::toDomain)
                .collect(Collectors.toList());
    }

    public static List<WithdrawalEntity> toEntityList(List<Withdrawal> domains) {
        if (domains == null) return List.of();
        return domains.stream()
                .map(WithdrawalMapper::toEntity)
                .collect(Collectors.toList());
    }
}
