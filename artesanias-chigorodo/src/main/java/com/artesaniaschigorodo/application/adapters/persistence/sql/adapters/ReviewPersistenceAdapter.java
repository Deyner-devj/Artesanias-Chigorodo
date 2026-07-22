package com.artesaniaschigorodo.application.adapters.persistence.sql.adapters;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.ReviewEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.mappers.ReviewMapper;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.ReviewRepository;
import com.artesaniaschigorodo.domain.models.review.Review;
import com.artesaniaschigorodo.domain.ports.out.ReviewPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ReviewPersistenceAdapter implements ReviewPort {

    private final ReviewRepository reviewRepository;

    @Override
    public Review save(Review review) {
        ReviewEntity entity = ReviewMapper.toEntity(review);
        ReviewEntity saved = reviewRepository.save(entity);
        return ReviewMapper.toDomain(saved);
    }

    @Override
    public List<Review> findByProductId(Long productId) {
        return reviewRepository.findByProductId(productId).stream()
                .map(ReviewMapper::toDomain)
                .collect(Collectors.toList());
    }
}
