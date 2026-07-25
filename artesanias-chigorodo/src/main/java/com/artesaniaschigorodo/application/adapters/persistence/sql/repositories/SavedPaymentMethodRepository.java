package com.artesaniaschigorodo.application.adapters.persistence.sql.repositories;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.SavedPaymentMethodEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedPaymentMethodRepository extends JpaRepository<SavedPaymentMethodEntity, Long> {
    List<SavedPaymentMethodEntity> findByUserId(Long userId);
    Optional<SavedPaymentMethodEntity> findByUserIdAndIsDefaultTrue(Long userId);
    List<SavedPaymentMethodEntity> findByUserIdOrderByIsDefaultDesc(Long userId);
}
