package com.artesaniaschigorodo.application.adapters.api.response;

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
public class CartResponse {

	private String userEmail;
	private List<CartItemResponse> items;
	private Integer totalQuantity;
	private Double subtotal;
	private LocalDateTime updatedAt;

	@Data
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class CartItemResponse {
		private Long productId;
		private String productName;
		private String imageUrl;
		private Integer stock;
		private Integer quantity;
		private Double unitPrice;
		private Double subtotal;
	}
}
