package com.artesaniaschigorodo.domain.ports.out;

import com.artesaniaschigorodo.domain.models.user.ArtisanProfile;
import java.util.Optional;

public interface ArtisanProfilePort {
    ArtisanProfile save(ArtisanProfile profile);
    Optional<ArtisanProfile> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
