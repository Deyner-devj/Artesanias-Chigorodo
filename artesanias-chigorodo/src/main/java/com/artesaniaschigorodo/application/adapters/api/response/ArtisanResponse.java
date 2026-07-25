package com.artesaniaschigorodo.application.adapters.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtisanResponse {
    private Long id;
    private String fullName;
    private String specialty;
    private String businessName;
    private String bio;
    private String city;
    private String instagram;
    private String whatsapp;
    private String imageUrl;
    private Long productCount;
    private Double rating;
}
