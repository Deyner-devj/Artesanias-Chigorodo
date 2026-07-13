package com.artesaniaschigorodo.domain.models.cart;

import com.artesaniaschigorodo.domain.models.product.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

	private Product product;
	private Integer quantity;
	private Double unitPrice;
	private Double subtotal;
}
