package com.artesaniaschigorodo.application.adapters.api.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {

    @NotEmpty(message = "La orden debe tener al menos un producto.")
    @Valid
    private List<OrderItemRequest> items;

    @NotNull(message = "Los detalles de envío son obligatorios.")
    @Valid
    private ShippingDetailsRequest shippingDetails;

    @NotNull(message = "Los detalles de pago son obligatorios.")
    @Valid
    private PaymentDetailsRequest paymentDetails;
}
