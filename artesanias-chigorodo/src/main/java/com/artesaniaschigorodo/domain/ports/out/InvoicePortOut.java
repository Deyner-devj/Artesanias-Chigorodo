package com.artesaniaschigorodo.domain.ports.out;

import com.artesaniaschigorodo.domain.models.order.Invoice;

import java.util.Optional;

public interface InvoicePortOut {
    Invoice save(Invoice invoice);
    Optional<Invoice> findByOrderNumber(String orderNumber);
}

