package com.artesaniaschigorodo.application.adapters.persistence.sql.adapters;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.InvoiceEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.mappers.InvoiceMapper;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.InvoiceJpaRepository;
import com.artesaniaschigorodo.domain.models.order.Invoice;
import com.artesaniaschigorodo.domain.ports.out.InvoicePersistencePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class InvoicePersistenceAdapter implements InvoicePersistencePort {

    private final InvoiceJpaRepository invoiceJpaRepository;

    @Override
    public Invoice save(Invoice invoice) {
        InvoiceEntity entity = InvoiceMapper.toEntity(invoice);
        InvoiceEntity saved = invoiceJpaRepository.save(entity);
        return InvoiceMapper.toDomain(saved);
    }

    @Override
    public Optional<Invoice> findByOrderNumber(String orderNumber) {
        return invoiceJpaRepository.findByOrderNumber(orderNumber).map(InvoiceMapper::toDomain);
    }
}

