package com.artesaniaschigorodo.application.adapters.persistence.sql.repositories;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.FavoriteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FavoriteRepository extends JpaRepository<FavoriteEntity, Long> {
    List<FavoriteEntity> findByUserIdOrderByCreatedAtDesc(Long userId);
    boolean existsByUserIdAndProductId(Long userId, Long productId);
    void deleteByUserIdAndProductId(Long userId, Long productId);
}
