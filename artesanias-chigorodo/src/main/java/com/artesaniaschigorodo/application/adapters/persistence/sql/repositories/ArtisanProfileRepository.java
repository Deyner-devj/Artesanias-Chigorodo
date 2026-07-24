package com.artesaniaschigorodo.application.adapters.persistence.sql.repositories;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.ArtisanProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ArtisanProfileRepository extends JpaRepository<ArtisanProfileEntity, Long> {
    Optional<ArtisanProfileEntity> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
