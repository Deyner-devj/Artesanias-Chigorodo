package com.artesaniaschigorodo.application.adapters.persistence.mongodb.mappers;

import com.artesaniaschigorodo.application.adapters.persistence.mongodb.documents.ProductDocument;
import com.artesaniaschigorodo.domain.models.enums.Category;
import com.artesaniaschigorodo.domain.models.product.Product;

public class ProductMongoMapper {

    public static ProductDocument toDocument(Product domain) {
        if (domain == null) return null;
        return ProductDocument.builder()
                .id(domain.getId())
                .name(domain.getName())
                .description(domain.getDescription())
                .price(domain.getPrice())
                .sellerId(domain.getSellerId())
                .sellerName(domain.getSellerName())
                .rating(domain.getRating())
                .reviewsCount(domain.getReviewsCount())
                .imageUrls(domain.getImageUrls())
                .colors(domain.getColors())
                .category(domain.getCategory() != null ? domain.getCategory().name() : null)
                .stock(domain.getStock())
                .build();
    }

    public static Product toDomain(ProductDocument doc) {
        if (doc == null) return null;
        return Product.builder()
                .id(doc.getId())
                .name(doc.getName())
                .description(doc.getDescription())
                .price(doc.getPrice())
                .sellerId(doc.getSellerId())
                .sellerName(doc.getSellerName())
                .rating(doc.getRating())
                .reviewsCount(doc.getReviewsCount())
                .imageUrls(doc.getImageUrls())
                .colors(doc.getColors())
                .category(doc.getCategory() != null ? Category.valueOf(doc.getCategory()) : null)
                .stock(doc.getStock())
                .build();
    }
}
