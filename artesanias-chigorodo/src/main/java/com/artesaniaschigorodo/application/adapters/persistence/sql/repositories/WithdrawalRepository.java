package com.artesaniaschigorodo.application.adapters.persistence.sql.repositories;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.WithdrawalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WithdrawalRepository extends JpaRepository<WithdrawalEntity, Long> {
    
    List<WithdrawalEntity> findByArtisanIdOrderByRequestedAtDesc(Long artisanId);
    
    Optional<WithdrawalEntity> findByTransactionReference(String transactionReference);
    
    @Query("SELECT w FROM WithdrawalEntity w WHERE w.artisanId = :artisanId AND w.status = :status ORDER BY w.requestedAt DESC")
    List<WithdrawalEntity> findByArtisanIdAndStatusOrderByRequestedAtDesc(Long artisanId, WithdrawalEntity.WithdrawalStatus status);
    
    @Query("SELECT COALESCE(SUM(w.amount), 0.0) FROM WithdrawalEntity w WHERE w.artisanId = :artisanId AND w.status = 'COMPLETED'")
    Double getTotalWithdrawnByArtisan(Long artisanId);
    
    @Query("SELECT COALESCE(SUM(w.amount), 0.0) FROM WithdrawalEntity w WHERE w.artisanId = :artisanId AND w.status IN ('PENDING', 'PROCESSING')")
    Double getTotalPendingWithdrawalsByArtisan(Long artisanId);
}
