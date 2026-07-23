package com.artesaniaschigorodo.domain.ports.in;

import com.artesaniaschigorodo.domain.models.order.Order;
import com.artesaniaschigorodo.domain.models.user.User;
import java.util.List;

public interface ListOrderByUserPort {
    List<Order> getOrdersByUser(User user);
}
