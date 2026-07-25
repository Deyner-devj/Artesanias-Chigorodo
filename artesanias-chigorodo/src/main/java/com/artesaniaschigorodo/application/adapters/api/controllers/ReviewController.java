package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.request.ReviewRequest;
import com.artesaniaschigorodo.application.adapters.api.response.ReviewResponse;
import com.artesaniaschigorodo.application.useCases.CreateReviewUseCase;
import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.review.Review;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.out.UserPort;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

	private final CreateReviewUseCase createReviewUseCase;
	private final UserPort userPersistencePort;

	@PostMapping
	public ResponseEntity<ReviewResponse> createReview(@Valid @RequestBody ReviewRequest request) {
		Review review = createReviewUseCase.createReview(request, getCurrentUser());
		return ResponseEntity.ok(mapToResponse(review));
	}

	@GetMapping("/product/{productId}")
	public ResponseEntity<List<ReviewResponse>> getReviewsByProduct(@PathVariable Long productId) {
		List<ReviewResponse> reviews = createReviewUseCase.getReviewsByProductId(productId).stream()
				.map(this::mapToResponse)
				.collect(Collectors.toList());
		return ResponseEntity.ok(reviews);
	}

	@GetMapping("/featured")
	public ResponseEntity<List<ReviewResponse>> getFeaturedReviews() {
		List<ReviewResponse> reviews = createReviewUseCase.getFeaturedReviews().stream()
				.map(this::mapToResponse)
				.collect(Collectors.toList());
		return ResponseEntity.ok(reviews);
	}

	private User getCurrentUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			throw new ForbiddenOperationException("Debe iniciar sesión para publicar una reseña.");
		}
		return userPersistencePort.findByEmail(authentication.getName())
				.orElseThrow(() -> new ResourceNotFoundException("Usuario actual no encontrado en el sistema."));
	}

	private ReviewResponse mapToResponse(Review review) {
		return ReviewResponse.builder()
				.id(review.getId())
				.productId(review.getProductId())
				.productName(review.getProductName())
				.userId(review.getUserId())
				.userName(review.getUserName())
				.title(review.getTitle())
				.comment(review.getComment())
				.rating(review.getRating())
				.createdAt(review.getCreatedAt())
				.build();
	}
}
