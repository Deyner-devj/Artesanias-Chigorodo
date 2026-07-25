package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.response.ArtisanResponse;
import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.ArtisanProfileEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.ArtisanProfileRepository;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.ProductRepository;
import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.models.enums.UserStatus;
import com.artesaniaschigorodo.domain.models.user.ArtisanProfile;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.out.ArtisanProfilePort;
import com.artesaniaschigorodo.domain.ports.out.UserPort;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/** Directorio publico. Nunca expone correo, contrasena ni datos privados. */
@RestController
@RequestMapping("/api/artisans")
@RequiredArgsConstructor
public class ArtisanController {
    private final UserPort users;
    private final ArtisanProfileRepository artisanProfileRepository;
    private final ProductRepository productRepository;
    private final ArtisanProfilePort artisanProfilePort;
    private final UserPort userPersistencePort;

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

    /**
     * Actualiza el perfil extendido de un artesano.
     * PUT /api/artisans/{id}
     * Solo el artesano dueño o admin puede actualizar.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateArtisanProfile(
            @PathVariable Long id, 
            @RequestBody UpdateArtisanProfileRequest request) {
        
        User currentUser = getCurrentUser();
        
        // Validar que el usuario es el artesano o admin
        if (!currentUser.getId().equals(id) && currentUser.getRole() != Role.ADMIN) {
            throw new ForbiddenOperationException("Solo puedes actualizar tu propio perfil de artesano o ser administrador");
        }
        
        // Obtener perfil existente o crear nuevo
        Optional<ArtisanProfile> existingProfileOpt = artisanProfilePort.findByUserId(id);
        ArtisanProfile profileToUpdate;
        
        if (existingProfileOpt.isPresent()) {
            profileToUpdate = existingProfileOpt.get();
        } else {
            profileToUpdate = ArtisanProfile.builder().userId(id).build();
        }
        
        // Actualizar campos
        if (request.getDisplayName() != null) {
            profileToUpdate.setDisplayName(request.getDisplayName());
        }
        if (request.getBusinessName() != null) {
            profileToUpdate.setBusinessName(request.getBusinessName());
        }
        if (request.getBio() != null) {
            profileToUpdate.setBio(request.getBio());
        }
        if (request.getCity() != null) {
            profileToUpdate.setCity(request.getCity());
        }
        if (request.getSpecialty() != null) {
            profileToUpdate.setSpecialty(request.getSpecialty());
        }
        if (request.getInstagram() != null) {
            profileToUpdate.setInstagram(request.getInstagram());
        }
        if (request.getWhatsapp() != null) {
            profileToUpdate.setWhatsapp(request.getWhatsapp());
        }
        if (request.getPhone() != null) {
            profileToUpdate.setPhone(request.getPhone());
        }
        if (request.getEmail() != null) {
            profileToUpdate.setEmail(request.getEmail());
        }
        if (request.getDocumentNumber() != null) {
            profileToUpdate.setDocumentNumber(request.getDocumentNumber());
        }
        if (request.getBank() != null) {
            profileToUpdate.setBank(request.getBank());
        }
        if (request.getAccountNumber() != null) {
            profileToUpdate.setAccountNumber(request.getAccountNumber());
        }
        if (request.getAccountType() != null) {
            profileToUpdate.setAccountType(request.getAccountType());
        }
        if (request.getAverageShippingTime() != null) {
            profileToUpdate.setAverageShippingTime(request.getAverageShippingTime());
        }
        if (request.getShippingCity() != null) {
            profileToUpdate.setShippingCity(request.getShippingCity());
        }
        if (request.getNotificationPreferences() != null) {
            profileToUpdate.setNotificationPreferences(request.getNotificationPreferences());
        }
        
        // Guardar perfil
        ArtisanProfile savedProfile = artisanProfilePort.save(profileToUpdate);
        
        return ResponseEntity.ok(Map.of(
            "message", "Perfil de artesano actualizado correctamente",
            "profile", savedProfile
        ));
    }

    /**
     * Obtiene el perfil extendido de un artesano (incluyendo configuración).
     * GET /api/artisans/{id}/profile
     */
    @GetMapping("/{id}/profile")
    public ResponseEntity<ArtisanProfile> getArtisanProfile(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        
        // Validar que el usuario es el artesano o admin
        if (!currentUser.getId().equals(id) && currentUser.getRole() != Role.ADMIN) {
            throw new ForbiddenOperationException("Solo puedes ver tu propio perfil de artesano o ser administrador");
        }
        
        return artisanProfilePort.findByUserId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ForbiddenOperationException("Debe iniciar sesión para acceder a esta información");
        }
        String email = authentication.getName();
        return userPersistencePort.findByEmail(email)
                .orElseThrow(() -> new ForbiddenOperationException("Usuario actual no encontrado"));
    }

    /**
     * DTO para actualizar perfil de artesano.
     */
    public static class UpdateArtisanProfileRequest {
        private String displayName;
        private String businessName;
        private String bio;
        private String city;
        private String specialty;
        private String instagram;
        private String whatsapp;
        private String phone;
        private String email;
        private String documentNumber;
        private String bank;
        private String accountNumber;
        private String accountType;
        private Integer averageShippingTime;
        private String shippingCity;
        private String notificationPreferences;

        // Getters y Setters
        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }
        public String getBusinessName() { return businessName; }
        public void setBusinessName(String businessName) { this.businessName = businessName; }
        public String getBio() { return bio; }
        public void setBio(String bio) { this.bio = bio; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public String getSpecialty() { return specialty; }
        public void setSpecialty(String specialty) { this.specialty = specialty; }
        public String getInstagram() { return instagram; }
        public void setInstagram(String instagram) { this.instagram = instagram; }
        public String getWhatsapp() { return whatsapp; }
        public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getDocumentNumber() { return documentNumber; }
        public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }
        public String getBank() { return bank; }
        public void setBank(String bank) { this.bank = bank; }
        public String getAccountNumber() { return accountNumber; }
        public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
        public String getAccountType() { return accountType; }
        public void setAccountType(String accountType) { this.accountType = accountType; }
        public Integer getAverageShippingTime() { return averageShippingTime; }
        public void setAverageShippingTime(Integer averageShippingTime) { this.averageShippingTime = averageShippingTime; }
        public String getShippingCity() { return shippingCity; }
        public void setShippingCity(String shippingCity) { this.shippingCity = shippingCity; }
        public String getNotificationPreferences() { return notificationPreferences; }
        public void setNotificationPreferences(String notificationPreferences) { this.notificationPreferences = notificationPreferences; }
    }
}

