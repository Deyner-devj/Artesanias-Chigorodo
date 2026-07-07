package com.artesaniaschigorodo.domain.ports.in;

import com.artesaniaschigorodo.domain.models.Order;
import com.artesaniaschigorodo.domain.models.User;

import java.util.List;

public interface OrderUseCase {
    Order createOrder(Order order, User currentUser);
    Order getOrderByOrderNumber(String orderNumber, User currentUser);
    List<Order> getOrdersForUser(User currentUser);
    Order updateOrderStatus(String orderNumber, String status, User currentUser);
}
