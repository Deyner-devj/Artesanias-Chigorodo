package com.artesaniaschigorodo.application.adapters.persistence.sql.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favorites", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "product_id"}))
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FavoriteEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_id", nullable = false)
    private Long userId;
    @Column(name = "product_id", nullable = false)
    private Long productId;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
