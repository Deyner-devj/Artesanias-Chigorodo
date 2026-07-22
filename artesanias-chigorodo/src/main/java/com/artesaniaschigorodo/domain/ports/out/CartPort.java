package com.artesaniaschigorodo.domain.ports.out;

import com.artesaniaschigorodo.domain.models.cart.Cart;

import java.util.Optional;

public interface CartPort {
    Optional<Cart> findByUserEmail(String userEmail);
    Cart save(Cart cart);
    void deleteByUserEmail(String userEmail);
}
