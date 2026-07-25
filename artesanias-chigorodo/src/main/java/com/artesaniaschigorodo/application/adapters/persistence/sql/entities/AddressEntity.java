package com.artesaniaschigorodo.application.adapters.persistence.sql.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "addresses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "recipient_name")
    private String recipientName;

    @Column(name = "address_line", nullable = false)
    private String addressLine;

    @Column(name = "neighborhood")
    private String neighborhood;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "department")
    private String department;

    @Column(name = "country", nullable = false)
    private String country;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "telephone")
    private String telephone;

    @Column(name = "is_default")
    private boolean isDefault;

    @Column(name = "address_type")
    private String addressType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private UserEntity user;
}
