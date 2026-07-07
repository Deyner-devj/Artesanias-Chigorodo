package com.artesaniaschigorodo.domain.models.order;

import com.artesaniaschigorodo.domain.models.product.Product;
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

