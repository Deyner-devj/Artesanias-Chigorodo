package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.response.ArtisanResponse;
import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.ArtisanProfileEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.ArtisanProfileRepository;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.ProductRepository;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.models.enums.UserStatus;
import com.artesaniaschigorodo.domain.ports.out.UserPort;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** Directorio publico. Nunca expone correo, contrasena ni datos privados. */
@RestController
@RequestMapping("/api/artisans")
@RequiredArgsConstructor
public class ArtisanController {
    private final UserPort users;
    private final ArtisanProfileRepository artisanProfileRepository;
    private final ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<ArtisanResponse>> getActiveArtisans() {
        List<ArtisanResponse> result = users.findAllByRole(Role.VENDOR).stream()
                .filter(user -> user.getStatus() == UserStatus.ACTIVE)
                .map(user -> {
                    ArtisanProfileEntity profile = artisanProfileRepository.findByUserId(user.getId()).orElse(null);
                    
                    Long productCount = productRepository.countBySellerId(user.getId());
                    
                    Double rating = productRepository.findBySellerId(user.getId()).stream()
                            .mapToDouble(p -> p.getRating() != null ? p.getRating() : 0.0)
                            .average()
                            .orElse(0.0);
                    
                    return ArtisanResponse.builder()
                            .id(user.getId())
                            .fullName(user.getFullName())
                            .specialty(profile != null ? profile.getSpecialty() : user.getSpecialty())
                            .businessName(profile != null ? profile.getBusinessName() : null)
                            .bio(profile != null ? profile.getBio() : null)
                            .city(profile != null ? profile.getCity() : null)
                            .instagram(profile != null ? profile.getInstagram() : null)
                            .whatsapp(profile != null ? profile.getWhatsapp() : null)
                            .imageUrl(null)
                            .productCount(productCount)
                            .rating(Math.round(rating * 10) / 10.0)
                            .build();
                })
                .toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtisanResponse> getArtisanById(@PathVariable Long id) {
        return users.findById(id)
                .filter(user -> user.getRole() == Role.VENDOR)
                .map(user -> {
                    ArtisanProfileEntity profile = artisanProfileRepository.findByUserId(user.getId()).orElse(null);
                    
                    Long productCount = productRepository.countBySellerId(user.getId());
                    
                    Double rating = productRepository.findBySellerId(user.getId()).stream()
                            .mapToDouble(p -> p.getRating() != null ? p.getRating() : 0.0)
                            .average()
                            .orElse(0.0);
                    
                    return ArtisanResponse.builder()
                            .id(user.getId())
                            .fullName(user.getFullName())
                            .specialty(profile != null ? profile.getSpecialty() : user.getSpecialty())
                            .businessName(profile != null ? profile.getBusinessName() : null)
                            .bio(profile != null ? profile.getBio() : null)
                            .city(profile != null ? profile.getCity() : null)
                            .instagram(profile != null ? profile.getInstagram() : null)
                            .whatsapp(profile != null ? profile.getWhatsapp() : null)
                            .imageUrl(null)
                            .productCount(productCount)
                            .rating(Math.round(rating * 10) / 10.0)
                            .build();
                })
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

