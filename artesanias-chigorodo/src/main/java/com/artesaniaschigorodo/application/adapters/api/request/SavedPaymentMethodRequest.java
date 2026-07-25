package com.artesaniaschigorodo.application.adapters.api.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedPaymentMethodRequest {

    @NotBlank(message = "El tipo de tarjeta es obligatorio")
    private String cardType;

    @NotBlank(message = "El número de tarjeta es obligatorio")
    @Pattern(regexp = "^[0-9]{13,19}$", message = "El número de tarjeta debe tener entre 13 y 19 dígitos")
    private String cardNumber;

    @NotBlank(message = "El nombre del titular es obligatorio")
    private String cardHolderName;

    @NotBlank(message = "La fecha de expiración es obligatoria")
    @Pattern(regexp = "^(0[1-9]|1[0-2])\\/[0-9]{2}$", message = "La fecha debe estar en formato MM/AA")
    private String expiryDate;

    private String cvv;

    @NotNull(message = "Debe indicar si es el método de pago predeterminado")
    private boolean isDefault;
}
