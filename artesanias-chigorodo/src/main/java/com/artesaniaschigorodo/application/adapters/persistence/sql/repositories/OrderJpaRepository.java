package com.artesaniaschigorodo.application.adapters.persistence.sql.repositories;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderJpaRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<OrderEntity> findAllByOrderByCreatedAtDesc();
    Optional<OrderEntity> findByOrderNumber(String orderNumber);
}

