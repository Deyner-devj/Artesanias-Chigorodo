package com.artesaniaschigorodo.domain.models.financial;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Withdrawal {

    private Long id;
    private Long artisanId;
    private String artisanName;
    private String bankName;
    private String accountNumber;
    private String accountType;
    private Double amount;
    private Double platformCommission;
    private Double netAmount;
    private WithdrawalStatus status;
    private String transactionReference;
    private LocalDateTime requestedAt;
    private LocalDateTime processedAt;
    private String notes;

    public enum WithdrawalStatus {
        PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED
    }
}
