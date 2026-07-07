package com.artesaniaschigorodo.application.adapters.persistence.sql.mappers;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.ProductEntity;
import com.artesaniaschigorodo.domain.models.Product;
import com.artesaniaschigorodo.domain.models.enums.Category;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ProductMapper {

    public static ProductEntity toEntity(Product domain) {
        if (domain == null) return null;
        return ProductEntity.builder()
                .id(domain.getId())
                .name(domain.getName())
                .description(domain.getDescription())
                .price(domain.getPrice())
                .sellerId(domain.getSellerId())
                .sellerName(domain.getSellerName())
                .rating(domain.getRating())
                .reviewsCount(domain.getReviewsCount())
                .imageUrls(domain.getImageUrls() != null ? String.join(",", domain.getImageUrls()) : null)
                .colors(domain.getColors() != null ? String.join(",", domain.getColors()) : null)
                .category(domain.getCategory() != null ? domain.getCategory().name() : null)
                .stock(domain.getStock())
                .build();
    }

    public static Product toDomain(ProductEntity entity) {
        if (entity == null) return null;
        return Product.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .sellerId(entity.getSellerId())
                .sellerName(entity.getSellerName())
                .rating(entity.getRating())
                .reviewsCount(entity.getReviewsCount())
                .imageUrls(parseCommaSeparated(entity.getImageUrls()))
                .colors(parseCommaSeparated(entity.getColors()))
                .category(entity.getCategory() != null ? Category.valueOf(entity.getCategory()) : null)
                .stock(entity.getStock())
                .build();
    }

    private static List<String> parseCommaSeparated(String str) {
        if (str == null || str.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.asList(str.split(","));
    }
}
