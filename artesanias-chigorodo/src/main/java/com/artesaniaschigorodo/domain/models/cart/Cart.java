package com.artesaniaschigorodo.domain.models.cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cart {

    private Long id;
    private String userEmail;
    @Builder.Default
    private List<CartItem> items = new ArrayList<>();
    private Integer totalQuantity;
    private Double subtotal;
    private LocalDateTime updatedAt;
}
