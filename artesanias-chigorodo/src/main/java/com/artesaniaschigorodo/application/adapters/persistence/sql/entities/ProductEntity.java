package com.artesaniaschigorodo.application.adapters.persistence.sql.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(name = "seller_id")
    private Long sellerId;

    @Column(name = "seller_name", nullable = false)
    private String sellerName;

    private Double rating;

    @Column(name = "reviews_count")
    private Integer reviewsCount;

    @Column(name = "image_urls", columnDefinition = "TEXT")
    private String imageUrls; // Comma-separated list of URLs

    @Column(columnDefinition = "TEXT")
    private String colors; // Comma-separated list of colors

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Integer stock;
}
