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
}

