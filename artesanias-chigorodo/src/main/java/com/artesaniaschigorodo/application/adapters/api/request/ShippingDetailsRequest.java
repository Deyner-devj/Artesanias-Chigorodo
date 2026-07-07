package com.artesaniaschigorodo.application.adapters.api.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ShippingDetailsRequest {

    @NotBlank(message = "El país es obligatorio.")
    private String country;

    @NotBlank(message = "El departamento es obligatorio.")
    private String department;

    @NotBlank(message = "La ciudad es obligatoria.")
    private String city;

    @NotBlank(message = "La dirección es obligatoria.")
    private String address;

    private String postalCode;

    @NotBlank(message = "El método de envío es obligatorio.")
    private String shippingMethod; // STANDARD, EXPRESS, PICKUP
}
