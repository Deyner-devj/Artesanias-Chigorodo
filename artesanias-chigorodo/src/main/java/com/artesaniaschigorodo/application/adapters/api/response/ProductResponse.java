package com.artesaniaschigorodo.application.adapters.api.response;

import com.artesaniaschigorodo.domain.models.enums.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Long sellerId;
    private String sellerName;
    private Double rating;
    private Integer reviewsCount;
    private List<String> imageUrls;
    private List<String> colors;
    private Category category;
    private Integer stock;
    private Boolean isFavorite;
}