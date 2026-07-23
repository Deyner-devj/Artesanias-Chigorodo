package com.artesaniaschigorodo.application.adapters.persistence.sql.repositories;
import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.PasswordResetTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetTokenEntity, Long> {
    Optional<PasswordResetTokenEntity> findByToken(String token);
    void deleteByUserId(Long userId);
}
