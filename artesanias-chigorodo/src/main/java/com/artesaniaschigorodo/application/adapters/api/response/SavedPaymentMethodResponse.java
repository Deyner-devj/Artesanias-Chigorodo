package com.artesaniaschigorodo.application.adapters.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedPaymentMethodResponse {
    private Long id;
    private Long userId;
    private String cardType;
    private String lastFourDigits;
    private String cardHolderName;
    private String expiryDate;
    private boolean isDefault;
}