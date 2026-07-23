package com.artesaniaschigorodo.application.useCases;

import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.models.review.Review;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.in.GetProductDetailsPort;
import com.artesaniaschigorodo.domain.ports.out.ProductPort;
import com.artesaniaschigorodo.domain.ports.out.ReviewPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetProductDetailsUseCase implements GetProductDetailsPort {

    private final ProductPort productPersistencePort;
    private final ReviewPort reviewPersistencePort;

    @Override
    public Product getProductById(Long id) {
        return productPersistencePort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("El producto no existe."));
    }

    @Override
    public Product getProductWithReviews(Long id, User currentUser) {
        Product product = getProductById(id);
        List<Review> reviews = reviewPersistencePort.findByProductId(id);
        product.setReviewsCount(reviews.size());
        product.setRating(Math.round(reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(5.0) * 10.0) / 10.0);
        return product;
    }
}
