package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.response.ProductResponse;
import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.FavoriteEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.FavoriteRepository;
import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.in.ProductPort;
import com.artesaniaschigorodo.domain.ports.out.UserPort;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {
    private final FavoriteRepository favorites;
    private final ProductPort products;
    private final UserPort users;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> list() {
        User user = currentUser();
        return ResponseEntity.ok(favorites.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(FavoriteEntity::getProductId).map(products::getProductById).map(this::toResponse).toList());
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Void> add(@PathVariable Long productId) {
        User user = currentUser();
        products.getProductById(productId);
        if (!favorites.existsByUserIdAndProductId(user.getId(), productId)) {
            favorites.save(FavoriteEntity.builder().userId(user.getId()).productId(productId).createdAt(LocalDateTime.now()).build());
        }
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> remove(@PathVariable Long productId) {
        favorites.deleteByUserIdAndProductId(currentUser().getId(), productId);
        return ResponseEntity.noContent().build();
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null || "anonymousUser".equals(email)) throw new ForbiddenOperationException("Debe iniciar sesion para gestionar favoritos.");
        return users.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Usuario actual no encontrado."));
    }

    private ProductResponse toResponse(Product p) {
        return ProductResponse.builder().id(p.getId()).name(p.getName()).description(p.getDescription()).price(p.getPrice())
                .sellerId(p.getSellerId()).sellerName(p.getSellerName()).rating(p.getRating()).reviewsCount(p.getReviewsCount())
                .imageUrls(p.getImageUrls()).colors(p.getColors()).category(p.getCategory()).stock(p.getStock()).build();
    }
}
