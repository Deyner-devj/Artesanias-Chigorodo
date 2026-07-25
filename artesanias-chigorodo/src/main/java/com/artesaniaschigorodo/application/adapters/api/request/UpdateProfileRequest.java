package com.artesaniaschigorodo.application.adapters.api.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotBlank
    @Size(min = 2, max = 100)
    private String fullName;

    @Email
    @NotBlank
    private String email;

    @Size(min = 10, max = 15)
    private String telephone;

    private String specialty;
}