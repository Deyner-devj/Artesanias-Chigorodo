package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.request.ProductRequest;
import com.artesaniaschigorodo.application.adapters.api.response.ProductResponse;
import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.models.client.User;
import com.artesaniaschigorodo.domain.models.enums.Category;
import com.artesaniaschigorodo.domain.ports.in.ProductUseCase;
import com.artesaniaschigorodo.domain.ports.out.UserPersistencePort;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductUseCase productUseCase;
    private final UserPersistencePort userPersistencePort;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String search
    ) {
        List<ProductResponse> responses = productUseCase.getFilteredProducts(category, minPrice, maxPrice, search).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        Product product = productUseCase.getProductById(id);
        return ResponseEntity.ok(mapToResponse(product));
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        User currentUser = getCurrentUser();
        Product product = mapToDomain(request);
        Product created = productUseCase.createProduct(product, currentUser);
        return ResponseEntity.ok(mapToResponse(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        User currentUser = getCurrentUser();
        Product product = mapToDomain(request);
        Product updated = productUseCase.updateProduct(id, product, currentUser);
        return ResponseEntity.ok(mapToResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        productUseCase.deleteProduct(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ForbiddenOperationException("Debe iniciar sesión para realizar esta operación.");
        }
        String email = authentication.getName();
        return userPersistencePort.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario actual no encontrado en el sistema."));
    }

    private Product mapToDomain(ProductRequest request) {
        Category category = Category.TEXTILES;
        try {
            category = Category.valueOf(request.getCategory().toUpperCase());
        } catch (IllegalArgumentException e) {
            // Default to textiles
        }

        return Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .sellerName(request.getSellerName())
                .imageUrls(request.getImageUrls())
                .colors(request.getColors())
                .category(category)
                .stock(request.getStock())
                .build();
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .sellerId(product.getSellerId())
                .sellerName(product.getSellerName())
                .rating(product.getRating())
                .reviewsCount(product.getReviewsCount())
                .imageUrls(product.getImageUrls())
                .colors(product.getColors())
                .category(product.getCategory() != null ? product.getCategory().name() : null)
                .stock(product.getStock())
                .build();
    }
}

