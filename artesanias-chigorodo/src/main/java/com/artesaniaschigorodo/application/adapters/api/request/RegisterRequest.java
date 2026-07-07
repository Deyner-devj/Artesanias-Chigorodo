package com.artesaniaschigorodo.application.adapters.api.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "El nombre completo es obligatorio.")
    private String fullName;

    @NotBlank(message = "El correo electrónico es obligatorio.")
    @Email(message = "El formato del correo electrónico es inválido.")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria.")
    private String password;

    private String role; // CLIENT, VENDOR, ADMIN
}
