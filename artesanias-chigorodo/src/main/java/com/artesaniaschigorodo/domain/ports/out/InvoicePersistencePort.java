package com.artesaniaschigorodo.domain.ports.out;

import com.artesaniaschigorodo.domain.models.Invoice;

import java.util.Optional;

public interface InvoicePersistencePort {
    Invoice save(Invoice invoice);
    Optional<Invoice> findByOrderNumber(String orderNumber);
}
