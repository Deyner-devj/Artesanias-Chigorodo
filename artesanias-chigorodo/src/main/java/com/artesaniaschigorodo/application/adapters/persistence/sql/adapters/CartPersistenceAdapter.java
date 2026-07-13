package com.artesaniaschigorodo.application.adapters.persistence.sql.adapters;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.CartEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.mappers.CartMapper;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.CartRepository;
import com.artesaniaschigorodo.domain.models.cart.Cart;
import com.artesaniaschigorodo.domain.ports.out.CartPortOut;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CartPersistenceAdapter implements CartPortOut {

    private final CartRepository cartRepository;

    @Override
    public Optional<Cart> findByUserEmail(String userEmail) {
        return cartRepository.findByUserEmail(userEmail)
                .map(CartMapper::toDomain);
    }

    @Override
    public Cart save(Cart cart) {
        CartEntity entity = CartMapper.toEntity(cart);
        CartEntity saved = cartRepository.save(entity);
        return CartMapper.toDomain(saved);
    }

    @Override
    public void deleteByUserEmail(String userEmail) {
        cartRepository.deleteByUserEmail(userEmail);
    }
}
