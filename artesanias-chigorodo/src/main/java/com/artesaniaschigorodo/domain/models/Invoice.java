package com.artesaniaschigorodo.domain.models;

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
    private String cufe; // Código Único de Facturación Electrónica (Colombia)
    private String qrCodeUrl;
    private LocalDateTime issueDate;
    private String status; // DIAN_APPROVED, REJECTED
    private Double totalAmount;
}
