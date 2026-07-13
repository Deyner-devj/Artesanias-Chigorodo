package com.artesaniaschigorodo.application.useCases;

import com.artesaniaschigorodo.application.adapters.api.response.DashboardResponse;
import com.artesaniaschigorodo.domain.models.enums.OrderStatus;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.models.order.Order;
import com.artesaniaschigorodo.domain.models.order.OrderItem;
import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.out.OrderPortOut;
import com.artesaniaschigorodo.domain.ports.out.ProductPortOut;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetArtisanDashboardUseCase {

	private final OrderPortOut orderPersistencePort;
	private final ProductPortOut productPersistencePort;

	public DashboardResponse getDashboard(User currentUser) {
		List<Product> products = loadProductsForUser(currentUser);
		List<Order> orders = loadOrdersForUser(currentUser);

		double totalSales = 0.0;
		for (Order order : orders) {
			if (order.getTotal() != null) {
				totalSales += order.getTotal();
			}
		}

		long pendingOrders = orders.stream()
				.filter(order -> order.getOrderStatus() == OrderStatus.PENDING)
				.count();

		long deliveredOrders = orders.stream()
				.filter(order -> order.getOrderStatus() == OrderStatus.DELIVERED)
				.count();

		orders.sort((left, right) -> {
			LocalDateTime leftDate = left != null ? left.getCreatedAt() : null;
			LocalDateTime rightDate = right != null ? right.getCreatedAt() : null;
			if (leftDate == null && rightDate == null) {
				return 0;
			}
			if (leftDate == null) {
				return 1;
			}
			if (rightDate == null) {
				return -1;
			}
			return rightDate.compareTo(leftDate);
		});

		List<DashboardResponse.RecentOrderResponse> recentOrders = orders.stream()
				.limit(5)
				.map(order -> DashboardResponse.RecentOrderResponse.builder()
						.orderNumber(order.getOrderNumber())
						.customerName(order.getUser() != null ? order.getUser().getFullName() : "Cliente")
						.createdAt(order.getCreatedAt())
						.total(order.getTotal())
						.status(toSpanishStatus(order.getOrderStatus()))
						.build())
				.collect(Collectors.toList());

		Map<Long, DashboardResponse.ProductSalesAccumulator> productSales = new LinkedHashMap<>();
		for (Order order : orders) {
			if (order.getItems() == null) {
				continue;
			}
			for (OrderItem item : order.getItems()) {
				if (item.getProduct() == null || item.getProduct().getId() == null) {
					continue;
				}
				Long productId = item.getProduct().getId();
				DashboardResponse.ProductSalesAccumulator accumulator = productSales.computeIfAbsent(productId, ignored -> {
					Product product = findProductById(products, productId);
					return DashboardResponse.ProductSalesAccumulator.builder()
							.productId(productId)
							.productName(product != null ? product.getName() : item.getProduct().getName())
							.quantitySold(0)
							.revenue(0.0)
							.build();
				});
				int quantity = item.getQuantity() != null ? item.getQuantity() : 0;
				double subtotal = item.getSubtotal() != null ? item.getSubtotal() : 0.0;
				accumulator.setQuantitySold(accumulator.getQuantitySold() + quantity);
				accumulator.setRevenue(accumulator.getRevenue() + subtotal);
			}
		}

		List<DashboardResponse.TopProductResponse> topProducts = productSales.values().stream()
				.sorted((left, right) -> Integer.compare(
						right.getQuantitySold() != null ? right.getQuantitySold() : 0,
						left.getQuantitySold() != null ? left.getQuantitySold() : 0))
				.limit(5)
				.map(accumulator -> DashboardResponse.TopProductResponse.builder()
						.productId(accumulator.getProductId())
						.productName(accumulator.getProductName())
						.quantitySold(accumulator.getQuantitySold())
						.revenue(accumulator.getRevenue())
						.build())
				.collect(Collectors.toList());

		return DashboardResponse.builder()
				.userName(currentUser != null ? currentUser.getFullName() : "Panel")
				.role(toSpanishRole(currentUser != null ? currentUser.getRole() : null))
				.totalProducts(products.size())
				.totalOrders(orders.size())
				.pendingOrders(pendingOrders)
				.deliveredOrders(deliveredOrders)
				.totalSales(totalSales)
				.recentOrders(recentOrders)
				.topProducts(topProducts)
				.generatedAt(LocalDateTime.now())
				.build();
	}

	private List<Product> loadProductsForUser(User currentUser) {
		List<Product> allProducts = productPersistencePort.findAll();
		if (currentUser == null || currentUser.getRole() == Role.ADMIN) {
			return allProducts;
		}
		if (currentUser.getRole() == Role.VENDOR) {
			return allProducts.stream()
					.filter(product -> product.getSellerName() != null && product.getSellerName().equalsIgnoreCase(currentUser.getFullName()))
					.collect(Collectors.toList());
		}
		return allProducts;
	}

	private List<Order> loadOrdersForUser(User currentUser) {
		List<Order> allOrders = orderPersistencePort.findByUserId(null);
		if (currentUser == null || currentUser.getRole() == Role.ADMIN) {
			return allOrders;
		}
		if (currentUser.getRole() == Role.CLIENT) {
			return orderPersistencePort.findByUserId(currentUser.getId());
		}
		return allOrders.stream()
				.filter(order -> order.getItems() != null && order.getItems().stream()
						.anyMatch(item -> item.getProduct() != null
								&& item.getProduct().getSellerName() != null
								&& item.getProduct().getSellerName().equalsIgnoreCase(currentUser.getFullName())))
				.map(order -> {
					List<OrderItem> filteredItems = order.getItems().stream()
							.filter(item -> item.getProduct() != null
									&& item.getProduct().getSellerName() != null
									&& item.getProduct().getSellerName().equalsIgnoreCase(currentUser.getFullName()))
							.collect(Collectors.toList());
					order.setItems(filteredItems);
					return order;
				})
				.collect(Collectors.toList());
	}

	private Product findProductById(List<Product> products, Long productId) {
		return products.stream()
				.filter(product -> product.getId() != null && product.getId().equals(productId))
				.findFirst()
				.orElse(null);
	}

	private String toSpanishStatus(OrderStatus status) {
		if (status == null) {
			return "Pendiente";
		}
		return switch (status) {
			case PENDING -> "Pendiente";
			case PAID -> "Pagado";
			case TRANSIT -> "En tránsito";
			case DELIVERED -> "Entregado";
			case CANCELLED -> "Cancelado";
		};
	}

	private String toSpanishRole(Role role) {
		if (role == null) {
			return "Visitante";
		}
		return switch (role) {
			case ADMIN -> "Administrador";
			case CLIENT -> "Cliente";
			case VENDOR -> "Vendedor";
		};
	}
}
