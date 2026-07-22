package com.artesaniaschigorodo.application.useCases;

import com.artesaniaschigorodo.domain.exceptions.BusinessException;
import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.cart.Cart;
import com.artesaniaschigorodo.domain.models.cart.CartItem;
import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.out.CartPort;
import com.artesaniaschigorodo.domain.ports.out.ProductPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class ManageCartUseCase {

    private final ProductPort productPersistencePort;
    private final CartPort cartPersistencePort;

    public Cart getCart(User currentUser) {
        Cart cart = cartPersistencePort.findByUserEmail(currentUser.getEmail().toLowerCase())
                .orElseGet(() -> Cart.builder()
                        .userEmail(currentUser.getEmail().toLowerCase())
                        .items(new ArrayList<>())
                        .build());
        recalculate(cart);
        return cart;
    }

    public Cart addItem(User currentUser, Long productId, Integer quantity) {
        Cart cart = getCart(currentUser);
        Product product = productPersistencePort.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("El producto no existe."));
        new com.artesaniaschigorodo.domain.services.ValidateProductAvailability().validate(product, quantity != null ? quantity : 0);
        CartItem existing = findItem(cart, productId);
        if (existing == null) {
            CartItem newItem = CartItem.builder()
                    .product(product)
                    .quantity(quantity)
                    .unitPrice(product.getPrice())
                    .build();
            new com.artesaniaschigorodo.domain.services.ValidateCartItem().validate(newItem);
            cart.getItems().add(newItem);
        } else {
            existing.setQuantity(existing.getQuantity() + quantity);
            existing.setProduct(product);
            existing.setUnitPrice(product.getPrice());
        }
        recalculate(cart);
        return cartPersistencePort.save(cart);
    }

    public Cart decreaseItem(User currentUser, Long productId) {
        Cart cart = getCart(currentUser);
        CartItem item = findItem(cart, productId);
        if (item == null) {
            throw new ResourceNotFoundException("El producto no está en el carrito.");
        }
        if (item.getQuantity() > 1) {
            item.setQuantity(item.getQuantity() - 1);
        } else {
            cart.getItems().remove(item);
        }
        recalculate(cart);
        return cartPersistencePort.save(cart);
    }

    public Cart removeItem(User currentUser, Long productId) {
        Cart cart = getCart(currentUser);
        cart.getItems().removeIf(item -> item.getProduct() != null && productId.equals(item.getProduct().getId()));
        recalculate(cart);
        return cartPersistencePort.save(cart);
    }

    public Cart clearCart(User currentUser) {
        Cart cart = getCart(currentUser);
        cart.getItems().clear();
        recalculate(cart);
        return cartPersistencePort.save(cart);
    }

    private void recalculate(Cart cart) {
        int totalQuantity = 0;
        double subtotal = 0.0;
        for (CartItem item : cart.getItems()) {
            int quantity = item.getQuantity() != null ? item.getQuantity() : 0;
            double unitPrice = item.getUnitPrice() != null ? item.getUnitPrice() : 0.0;
            item.setSubtotal(quantity * unitPrice);
            totalQuantity += quantity;
            subtotal += item.getSubtotal();
        }
        cart.setTotalQuantity(totalQuantity);
        cart.setSubtotal(subtotal);
        cart.setUpdatedAt(LocalDateTime.now());
    }

    private CartItem findItem(Cart cart, Long productId) {
        for (CartItem item : cart.getItems()) {
            if (item.getProduct() != null && productId.equals(item.getProduct().getId())) {
                return item;
            }
        }
        return null;
    }
}
