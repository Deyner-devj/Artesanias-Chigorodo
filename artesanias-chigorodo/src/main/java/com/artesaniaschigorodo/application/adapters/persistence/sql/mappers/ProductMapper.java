package com.artesaniaschigorodo.application.adapters.persistence.sql.mappers;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.ProductEntity;
import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.models.enums.Category;

import java.util.ArrayList;
import java.util.List;

public class ProductMapper {

    public static ProductEntity toEntity(Product domain) {
        if (domain == null) {
            return null;
        }

        List<String> imageUrls = domain.getImageUrls() != null ? new ArrayList<>(domain.getImageUrls()) : new ArrayList<>();
        List<String> colors = domain.getColors() != null ? new ArrayList<>(domain.getColors()) : new ArrayList<>();

        return ProductEntity.builder()
                .id(domain.getId())
                .name(domain.getName())
                .description(domain.getDescription())
                .price(domain.getPrice())
                .sellerId(domain.getSellerId())
                .sellerName(domain.getSellerName())
                .rating(domain.getRating())
                .reviewsCount(domain.getReviewsCount())
                .imageUrls(imageUrls)
                .colors(colors)
                .category(domain.getCategory() != null ? domain.getCategory().name() : null)
                .stock(domain.getStock())
                .build();
    }

    public static Product toDomain(ProductEntity entity) {
        if (entity == null) {
            return null;
        }

        List<String> imageUrls = entity.getImageUrls() != null ? new ArrayList<>(entity.getImageUrls()) : new ArrayList<>();
        List<String> colors = entity.getColors() != null ? new ArrayList<>(entity.getColors()) : new ArrayList<>();

        return Product.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .sellerId(entity.getSellerId())
                .sellerName(entity.getSellerName())
                .rating(entity.getRating())
                .reviewsCount(entity.getReviewsCount())
                .imageUrls(imageUrls)
                .colors(colors)
                .category(entity.getCategory() != null ? Category.valueOf(entity.getCategory()) : null)
                .stock(entity.getStock())
                .build();
    }
}
