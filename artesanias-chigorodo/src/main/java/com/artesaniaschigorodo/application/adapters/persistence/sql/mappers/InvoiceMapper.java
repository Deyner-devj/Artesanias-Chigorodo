package com.artesaniaschigorodo.application.adapters.persistence.sql.mappers;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.InvoiceEntity;
import com.artesaniaschigorodo.domain.models.order.Invoice;

public class InvoiceMapper {

    public static InvoiceEntity toEntity(Invoice domain) {
        if (domain == null) return null;
        return InvoiceEntity.builder()
                .id(domain.getId())
                .orderNumber(domain.getOrderNumber())
                .cufe(domain.getCufe())
                .qrCodeUrl(domain.getQrCodeUrl())
                .issueDate(domain.getIssueDate())
                .status(domain.getStatus())
                .totalAmount(domain.getTotalAmount())
                .build();
    }

    public static Invoice toDomain(InvoiceEntity entity) {
        if (entity == null) return null;
        return Invoice.builder()
                .id(entity.getId())
                .orderNumber(entity.getOrderNumber())
                .cufe(entity.getCufe())
                .qrCodeUrl(entity.getQrCodeUrl())
                .issueDate(entity.getIssueDate())
                .status(entity.getStatus())
                .totalAmount(entity.getTotalAmount())
                .build();
    }
}

