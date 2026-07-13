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
public class DashboardResponse {

	private String userName;
	private String role;
	private long totalProducts;
	private long totalOrders;
	private long pendingOrders;
	private long deliveredOrders;
	private double totalSales;
	private List<RecentOrderResponse> recentOrders;
	private List<TopProductResponse> topProducts;
	private LocalDateTime generatedAt;

	@Data
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class RecentOrderResponse {
		private String orderNumber;
		private String customerName;
		private LocalDateTime createdAt;
		private Double total;
		private String status;
	}

	@Data
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class TopProductResponse {
		private Long productId;
		private String productName;
		private Integer quantitySold;
		private Double revenue;
	}

	@Data
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class ProductSalesAccumulator {
		private Long productId;
		private String productName;
		private Integer quantitySold;
		private Double revenue;
	}
}