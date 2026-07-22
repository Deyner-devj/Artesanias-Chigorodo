package com.artesaniaschigorodo.domain.services;

import com.artesaniaschigorodo.domain.exceptions.BusinessException;
import com.artesaniaschigorodo.domain.models.cart.CartItem;

public class ValidateCartItem {

    public void validate(CartItem item) {
        if (item == null) {
            throw new BusinessException("El ítem del carrito no puede ser nulo");
        }
        if (item.getQuantity() == null || item.getQuantity() <= 0) {
            throw new BusinessException("La cantidad agregada al carrito debe ser mayor a 0");
        }
    }
}
