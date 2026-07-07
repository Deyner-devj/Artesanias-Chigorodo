package com.artesaniaschigorodo.application.adapters.persistence.sql.repositories;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.InvoiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvoiceJpaRepository extends JpaRepository<InvoiceEntity, Long> {
    Optional<InvoiceEntity> findByOrderNumber(String orderNumber);
}

