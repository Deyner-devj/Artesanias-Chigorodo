package com.artesaniaschigorodo.application.adapters.api.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "El nombre completo es obligatorio.")
    private String fullName;

    @NotBlank(message = "El correo electrónico es obligatorio.")
    @Email(message = "El formato del correo electrónico es inválido.")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria.")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,100}$",
            message = "La contraseña debe tener entre 8 y 100 caracteres, incluir al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&).")
    private String password;

    private String role; // CLIENT, VENDOR, ADMIN
}

