package com.artesaniaschigorodo.domain.ports.in;

import com.artesaniaschigorodo.domain.models.order.Order;
import com.artesaniaschigorodo.domain.models.user.User;

import java.util.List;

public interface OrderPortIn {
    Order createOrder(Order order, User currentUser);
    Order getOrderByOrderNumber(String orderNumber, User currentUser);
    List<Order> getOrdersForUser(User currentUser);
    Order updateOrderStatus(String orderNumber, String status, User currentUser);
}

