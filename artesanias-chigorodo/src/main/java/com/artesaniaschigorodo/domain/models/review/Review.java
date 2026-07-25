package com.artesaniaschigorodo.domain.models.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    private Long id;
    private Long productId;
    private String productName;
    private Long userId;
    private String userName;
    private String title;
    private String comment;
    private Integer rating;
    private LocalDateTime createdAt;
}