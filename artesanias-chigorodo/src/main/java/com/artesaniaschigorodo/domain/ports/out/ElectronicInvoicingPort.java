package com.artesaniaschigorodo.domain.ports.out;

import com.artesaniaschigorodo.domain.models.Invoice;
import com.artesaniaschigorodo.domain.models.Order;

public interface ElectronicInvoicingPort {
    Invoice submitInvoice(Order order);
}
