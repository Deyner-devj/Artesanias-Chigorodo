package com.artesaniaschigorodo.application.useCases;

import com.artesaniaschigorodo.application.adapters.api.request.ReviewRequest;
import com.artesaniaschigorodo.domain.exceptions.BusinessException;
import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.models.review.Review;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.out.ProductPort;
import com.artesaniaschigorodo.domain.ports.out.ReviewPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CreateReviewUseCase {

    private final ProductPort productPersistencePort;
    private final ReviewPort reviewPersistencePort;

    public Review createReview(ReviewRequest request, User currentUser) {
        Product product = productPersistencePort.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("El producto no existe."));

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new BusinessException("La calificación debe estar entre 1 y 5.");
        }

        Review review = Review.builder()
                .productId(product.getId())
                .productName(product.getName())
                .userId(currentUser.getId())
                .userName(currentUser.getFullName())
                .title(request.getTitle())
                .comment(request.getComment())
                .rating(request.getRating())
                .createdAt(LocalDateTime.now())
                .build();

        Review savedReview = reviewPersistencePort.save(review);
        updateProductStats(product, product.getId());
        return savedReview;
    }

    public List<Review> getReviewsByProductId(Long productId) {
        return reviewPersistencePort.findByProductId(productId);
    }

    private void updateProductStats(Product product, Long productId) {
        List<Review> reviews = reviewPersistencePort.findByProductId(productId);
        int count = reviews.size();
        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        product.setReviewsCount(count);
        product.setRating(Math.round(average * 10.0) / 10.0);
        productPersistencePort.save(product);
    }
}
