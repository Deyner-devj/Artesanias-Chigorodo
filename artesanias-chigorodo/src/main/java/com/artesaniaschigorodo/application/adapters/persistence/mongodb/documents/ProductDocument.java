package com.artesaniaschigorodo.application.adapters.persistence.mongodb.documents;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Document(collection = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDocument {

    @Id
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
    private String category;
    private Integer stock;
}
