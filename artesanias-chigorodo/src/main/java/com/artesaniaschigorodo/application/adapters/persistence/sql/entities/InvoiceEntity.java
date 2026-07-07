package com.artesaniaschigorodo.application.adapters.persistence.sql.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true)
    private String orderNumber;

    @Column(nullable = false, unique = true)
    private String cufe;

    @Column(name = "qr_code_url")
    private String qrCodeUrl;

    @Column(name = "issue_date", nullable = false)
    private LocalDateTime issueDate;

    @Column(nullable = false)
    private String status;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;
}
