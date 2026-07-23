package com.artesaniaschigorodo.application.adapters.api.request;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data public class ForgotPasswordRequest { @NotBlank @Email private String email; }
