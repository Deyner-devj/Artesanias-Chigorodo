package com.artesaniaschigorodo.domain.ports.out;

import com.artesaniaschigorodo.domain.models.order.Order;

import java.util.List;
import java.util.Optional;

public interface OrderPersistencePort {
    Optional<Order> findById(Long id);
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByUserId(Long userId);
    Order save(Order order);
}

