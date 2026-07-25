package com.artesaniaschigorodo.domain.models.user;

import com.artesaniaschigorodo.domain.models.enums.PaymentMethod;
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
    private com.artesaniaschigorodo.domain.models.enums.PaymentMethod cardType;
    private String cardNumber;
    private String cardHolderName;
    private String expiryDate;
    private String cvv;
    private boolean isDefault;
    private String lastFourDigits;
}
