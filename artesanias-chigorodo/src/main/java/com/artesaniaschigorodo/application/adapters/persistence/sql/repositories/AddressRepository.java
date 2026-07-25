package com.artesaniaschigorodo.application.adapters.persistence.sql.repositories;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.AddressEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<AddressEntity, Long> {
    List<AddressEntity> findByUserId(Long userId);
    Optional<AddressEntity> findByUserIdAndIsDefaultTrue(Long userId);
    List<AddressEntity> findByUserIdOrderByIsDefaultDesc(Long userId);
}
