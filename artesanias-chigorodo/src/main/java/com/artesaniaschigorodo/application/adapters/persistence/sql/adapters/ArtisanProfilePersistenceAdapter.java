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
                .bio(profile.getBio())
                .city(profile.getCity())
                .instagram(profile.getInstagram())
                .whatsapp(profile.getWhatsapp())
                .build();
        
        ArtisanProfileEntity saved = artisanProfileRepository.save(entity);
        
        return ArtisanProfile.builder()
                .userId(saved.getUserId())
                .specialty(saved.getSpecialty())
                .businessName(saved.getBusinessName())
                .bio(saved.getBio())
                .city(saved.getCity())
                .instagram(saved.getInstagram())
                .whatsapp(saved.getWhatsapp())
                .build();
    }

    @Override
    public Optional<ArtisanProfile> findByUserId(Long userId) {
        return artisanProfileRepository.findByUserId(userId)
                .map(entity -> ArtisanProfile.builder()
                        .userId(entity.getUserId())
                        .specialty(entity.getSpecialty())
                        .businessName(entity.getBusinessName())
                        .bio(entity.getBio())
                        .city(entity.getCity())
                        .instagram(entity.getInstagram())
                        .whatsapp(entity.getWhatsapp())
                        .build());
    }

    @Override
    public void deleteByUserId(Long userId) {
        artisanProfileRepository.deleteByUserId(userId);
    }
}
