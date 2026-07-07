package com.artesaniaschigorodo.domain.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    private Product product;
    private Integer quantity;
    private Double unitPrice;
    private Double subtotal;
}
