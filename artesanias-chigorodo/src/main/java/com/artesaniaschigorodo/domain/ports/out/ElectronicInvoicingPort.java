package com.artesaniaschigorodo.domain.ports.out;

import com.artesaniaschigorodo.domain.models.order.Invoice;
import com.artesaniaschigorodo.domain.models.order.Order;

public interface ElectronicInvoicingPort {
    Invoice submitInvoice(Order order);
}

