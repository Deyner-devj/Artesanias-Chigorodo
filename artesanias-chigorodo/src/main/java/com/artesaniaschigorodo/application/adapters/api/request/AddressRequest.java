package com.artesaniaschigorodo.application.adapters.api.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequest {

    @NotBlank(message = "El nombre del destinatario es obligatorio")
    private String recipientName;

    @NotBlank(message = "La dirección es obligatoria")
    private String addressLine;

    private String neighborhood;

    @NotBlank(message = "La ciudad es obligatoria")
    private String city;

    private String department;

    @NotBlank(message = "El país es obligatorio")
    private String country;

    private String postalCode;

    private String telephone;

    private String addressType;

    @NotNull(message = "Debe indicar si es la dirección predeterminada")
    private boolean isDefault;
}
