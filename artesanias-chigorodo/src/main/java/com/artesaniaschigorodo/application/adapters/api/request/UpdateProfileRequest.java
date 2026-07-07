package com.artesaniaschigorodo.application.adapters.api.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "El nombre completo es obligatorio.")
    private String fullName;
}
