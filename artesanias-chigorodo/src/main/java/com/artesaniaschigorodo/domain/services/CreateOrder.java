package com.artesaniaschigorodo.domain.services;

import com.artesaniaschigorodo.domain.exceptions.BusinessException;
import com.artesaniaschigorodo.domain.models.order.Order;
import com.artesaniaschigorodo.domain.models.order.OrderItem;

public class CreateOrder {

    public void validateAndCalculate(Order order) {
        if (order == null || order.getItems() == null || order.getItems().isEmpty()) {
            throw new BusinessException("El pedido debe contener al menos un ítem");
        }
        double calculatedTotal = 0.0;
        for (OrderItem item : order.getItems()) {
            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                throw new BusinessException("La cantidad de cada ítem debe ser mayor a 0");
            }
            if (item.getUnitPrice() == null || item.getUnitPrice() < 0) {
                throw new BusinessException("El precio unitario no puede ser negativo");
            }
            calculatedTotal += item.getUnitPrice() * item.getQuantity();
        }
        order.setTotalAmount(calculatedTotal);
    }
}
