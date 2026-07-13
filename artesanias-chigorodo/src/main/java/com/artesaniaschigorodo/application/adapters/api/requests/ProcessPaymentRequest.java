package com.artesaniaschigorodo.application.adapters.api.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
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
public class ProcessPaymentRequest {

    @NotBlank(message = "El número de orden es requerido")
    private String orderNumber;

    @NotNull(message = "El monto es requerido")
    @Min(value = 1, message = "El monto debe ser mayor a 0")
    private Double amount;

    @NotBlank(message = "El email del usuario es requerido")
    @Email(message = "El email debe ser válido")
    private String userEmail;

    @NotBlank(message = "El método de pago es requerido")
    private String paymentMethod;
}
