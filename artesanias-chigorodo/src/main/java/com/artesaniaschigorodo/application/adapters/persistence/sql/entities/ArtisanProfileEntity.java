package com.artesaniaschigorodo.application.adapters.persistence.sql.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "artisan_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtisanProfileEntity {

    @Id
    @Column(name = "user_id")
    private Long userId;

    private String specialty;
    private String businessName;
    private String bio;
    private String city;
    private String instagram;
    private String whatsapp;
    
    // Campos de configuración extendida
    @Column(name = "display_name")
    private String displayName;
    @Column(name = "phone")
    private String phone;
    @Column(name = "email")
    private String email;
    @Column(name = "document_number")
    private String documentNumber;
    @Column(name = "bank")
    private String bank;
    @Column(name = "account_number")
    private String accountNumber;
    @Column(name = "account_type")
    private String accountType;
    @Column(name = "average_shipping_time")
    private Integer averageShippingTime;
    @Column(name = "shipping_city")
    private String shippingCity;
    @Column(name = "notification_preferences", length = 1000)
    private String notificationPreferences;
}

