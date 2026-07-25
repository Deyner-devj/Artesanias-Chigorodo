package com.artesaniaschigorodo.domain.models.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedPaymentMethod {
    private Long id;
    private Long userId;
    private String cardNumber;
    private String cardHolderName;
    private String expiryDate;
    private String cardType;
    private String cvv;
    private boolean isDefault;

    public String getLastFourDigits() {
        if (cardNumber != null && cardNumber.length() >= 4) {
            return cardNumber.substring(cardNumber.length() - 4);
        }
        return "****";
    }
}
