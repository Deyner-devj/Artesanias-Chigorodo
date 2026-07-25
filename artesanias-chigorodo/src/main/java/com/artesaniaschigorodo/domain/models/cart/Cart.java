package com.artesaniaschigorodo.domain.models.cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cart {
    private Long id;
    private String userEmail;
    private List<CartItem> items;
    private Integer totalQuantity;
    private Double subtotal;
    private LocalDateTime updatedAt;
}