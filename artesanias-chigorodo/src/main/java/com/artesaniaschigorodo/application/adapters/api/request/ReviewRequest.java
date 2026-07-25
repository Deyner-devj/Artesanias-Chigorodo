package com.artesaniaschigorodo.application.adapters.api.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import lombok.Data;

@Data
public class ReviewRequest {
    @NotNull
    private Long productId;

    @NotBlank
    private String title;

    @NotBlank
    private String comment;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;
}