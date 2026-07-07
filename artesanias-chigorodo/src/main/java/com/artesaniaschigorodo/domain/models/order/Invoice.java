package com.artesaniaschigorodo.domain.models.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {
    private Long id;
    private String orderNumber;
    private String cufe;
    private String qrCodeUrl;
    private LocalDateTime issueDate;
    private String status;
    private Double totalAmount;
}

