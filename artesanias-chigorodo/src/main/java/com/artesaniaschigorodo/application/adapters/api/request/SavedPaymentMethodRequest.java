package com.artesaniaschigorodo.application.adapters.api.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SavedPaymentMethodRequest {
    @NotBlank
    private String cardNumber;

    @NotBlank
    private String cardHolderName;

    @NotBlank
    private String expiryDate;

    @NotBlank
    private String cardType;

    private String cvv;

    @NotNull
    private boolean isDefault;
}