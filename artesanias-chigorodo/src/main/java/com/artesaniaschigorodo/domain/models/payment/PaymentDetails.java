package com.artesaniaschigorodo.domain.models.payment;

import com.artesaniaschigorodo.domain.models.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDetails {
    private PaymentMethod paymentMethod;
    private String transactionId;
    private String status;
}

