package com.artesaniaschigorodo.domain.ports.out;

import com.artesaniaschigorodo.domain.models.review.Review;

import java.util.List;

public interface ReviewPortOut {
    Review save(Review review);
    List<Review> findByProductId(Long productId);
}
