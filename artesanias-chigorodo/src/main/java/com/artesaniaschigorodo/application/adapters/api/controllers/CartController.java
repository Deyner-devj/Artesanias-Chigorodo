package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.request.CartItemRequest;
import com.artesaniaschigorodo.application.adapters.api.response.CartResponse;
import com.artesaniaschigorodo.application.useCases.ManageCartUseCase;
import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.cart.Cart;
import com.artesaniaschigorodo.domain.models.cart.CartItem;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.out.UserPortOut;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

	private final ManageCartUseCase manageCartUseCase;
	private final UserPortOut userPersistencePort;

	@GetMapping
	public ResponseEntity<CartResponse> getCart() {
		return ResponseEntity.ok(mapToResponse(manageCartUseCase.getCart(getCurrentUser())));
	}

	@PostMapping("/items")
	public ResponseEntity<CartResponse> addItem(@Valid @RequestBody CartItemRequest request) {
		return ResponseEntity.ok(mapToResponse(manageCartUseCase.addItem(getCurrentUser(), request.getProductId(), request.getQuantity())));
	}

	@PatchMapping("/items/{productId}/decrease")
	public ResponseEntity<CartResponse> decreaseItem(@PathVariable Long productId) {
		return ResponseEntity.ok(mapToResponse(manageCartUseCase.decreaseItem(getCurrentUser(), productId)));
	}

	@DeleteMapping("/items/{productId}")
	public ResponseEntity<CartResponse> removeItem(@PathVariable Long productId) {
		return ResponseEntity.ok(mapToResponse(manageCartUseCase.removeItem(getCurrentUser(), productId)));
	}

	@DeleteMapping
	public ResponseEntity<CartResponse> clearCart() {
		return ResponseEntity.ok(mapToResponse(manageCartUseCase.clearCart(getCurrentUser())));
	}

	private User getCurrentUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			throw new ForbiddenOperationException("Debe iniciar sesión para administrar el carrito.");
		}
		return userPersistencePort.findByEmail(authentication.getName())
				.orElseThrow(() -> new ResourceNotFoundException("Usuario actual no encontrado en el sistema."));
	}

	private CartResponse mapToResponse(Cart cart) {
		List<CartResponse.CartItemResponse> items = cart.getItems().stream()
				.map(this::mapToResponse)
				.collect(Collectors.toList());
		return CartResponse.builder()
				.userEmail(cart.getUserEmail())
				.items(items)
				.totalQuantity(cart.getTotalQuantity())
				.subtotal(cart.getSubtotal())
				.updatedAt(cart.getUpdatedAt())
				.build();
	}

	private CartResponse.CartItemResponse mapToResponse(CartItem item) {
		return CartResponse.CartItemResponse.builder()
				.productId(item.getProduct().getId())
				.productName(item.getProduct().getName())
				.quantity(item.getQuantity())
				.unitPrice(item.getUnitPrice())
				.subtotal(item.getSubtotal())
				.build();
	}
}
