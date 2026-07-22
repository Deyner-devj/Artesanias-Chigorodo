package com.artesaniaschigorodo.domain.services;

import com.artesaniaschigorodo.domain.exceptions.BusinessException;
import com.artesaniaschigorodo.domain.models.product.Product;

public class ValidateProductAvailability {

    public void validate(Product product, int requestedQuantity) {
        if (product == null) {
            throw new BusinessException("El producto no existe");
        }
        if (product.getStock() < requestedQuantity) {
            throw new BusinessException("Stock insuficiente para el producto: " + product.getName());
        }
    }
}
