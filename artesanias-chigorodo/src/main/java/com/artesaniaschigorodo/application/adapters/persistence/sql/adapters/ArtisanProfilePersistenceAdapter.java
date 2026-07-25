package com.artesaniaschigorodo.application.adapters.persistence.sql.adapters;

import com.artesaniaschigorodo.domain.models.user.ArtisanProfile;
import com.artesaniaschigorodo.domain.ports.out.ArtisanProfilePort;
import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.ArtisanProfileEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.ArtisanProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ArtisanProfilePersistenceAdapter implements ArtisanProfilePort {

    private final ArtisanProfileRepository artisanProfileRepository;

    @Override
    public ArtisanProfile save(ArtisanProfile profile) {
        ArtisanProfileEntity entity = ArtisanProfileEntity.builder()
                .userId(profile.getUserId())
                .specialty(profile.getSpecialty())
                .businessName(profile.getBusinessName())
                .displayName(profile.getDisplayName())
                .bio(profile.getBio())
                .city(profile.getCity())
                .instagram(profile.getInstagram())
                .whatsapp(profile.getWhatsapp())
                .phone(profile.getPhone())
                .email(profile.getEmail())
                .documentNumber(profile.getDocumentNumber())
                .bank(profile.getBank())
                .accountNumber(profile.getAccountNumber())
                .accountType(profile.getAccountType())
                .averageShippingTime(profile.getAverageShippingTime())
                .shippingCity(profile.getShippingCity())
                .notificationPreferences(profile.getNotificationPreferences())
                .build();
        
        ArtisanProfileEntity saved = artisanProfileRepository.save(entity);
        
        return ArtisanProfile.builder()
                .userId(saved.getUserId())
                .specialty(saved.getSpecialty())
                .businessName(saved.getBusinessName())
                .displayName(saved.getDisplayName())
                .bio(saved.getBio())
                .city(saved.getCity())
                .instagram(saved.getInstagram())
                .whatsapp(saved.getWhatsapp())
                .phone(saved.getPhone())
                .email(saved.getEmail())
                .documentNumber(saved.getDocumentNumber())
                .bank(saved.getBank())
                .accountNumber(saved.getAccountNumber())
                .accountType(saved.getAccountType())
                .averageShippingTime(saved.getAverageShippingTime())
                .shippingCity(saved.getShippingCity())
                .notificationPreferences(saved.getNotificationPreferences())
                .build();
    }

    @Override
    public Optional<ArtisanProfile> findByUserId(Long userId) {
        return artisanProfileRepository.findByUserId(userId)
                .map(entity -> ArtisanProfile.builder()
                        .userId(entity.getUserId())
                        .specialty(entity.getSpecialty())
                        .businessName(entity.getBusinessName())
                        .displayName(entity.getDisplayName())
                        .bio(entity.getBio())
                        .city(entity.getCity())
                        .instagram(entity.getInstagram())
                        .whatsapp(entity.getWhatsapp())
                        .phone(entity.getPhone())
                        .email(entity.getEmail())
                        .documentNumber(entity.getDocumentNumber())
                        .bank(entity.getBank())
                        .accountNumber(entity.getAccountNumber())
                        .accountType(entity.getAccountType())
                        .averageShippingTime(entity.getAverageShippingTime())
                        .shippingCity(entity.getShippingCity())
                        .notificationPreferences(entity.getNotificationPreferences())
                        .build());
    }

    @Override
    public void deleteByUserId(Long userId) {
        artisanProfileRepository.deleteByUserId(userId);
    }
}
