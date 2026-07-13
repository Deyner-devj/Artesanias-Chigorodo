package com.artesaniaschigorodo.application.adapters.persistence.sql.mappers;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.ReviewEntity;
import com.artesaniaschigorodo.domain.models.review.Review;

public class ReviewMapper {

    public static ReviewEntity toEntity(Review domain) {
        if (domain == null) {
            return null;
        }
        return ReviewEntity.builder()
                .id(domain.getId())
                .productId(domain.getProductId())
                .productName(domain.getProductName())
                .userId(domain.getUserId())
                .userName(domain.getUserName())
                .title(domain.getTitle())
                .comment(domain.getComment())
                .rating(domain.getRating())
                .createdAt(domain.getCreatedAt())
                .build();
    }

    public static Review toDomain(ReviewEntity entity) {
        if (entity == null) {
            return null;
        }
        return Review.builder()
                .id(entity.getId())
                .productId(entity.getProductId())
                .productName(entity.getProductName())
                .userId(entity.getUserId())
                .userName(entity.getUserName())
                .title(entity.getTitle())
                .comment(entity.getComment())
                .rating(entity.getRating())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
