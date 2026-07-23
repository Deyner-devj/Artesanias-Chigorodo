package com.artesaniaschigorodo.application.useCases;

import com.artesaniaschigorodo.domain.models.order.Order;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.in.ListOrderByUserPort;
import com.artesaniaschigorodo.domain.ports.out.OrderPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListOrderByUserUseCase implements ListOrderByUserPort {

    private final OrderPort orderPersistencePort;

    @Override
    public List<Order> getOrdersByUser(User user) {
        return orderPersistencePort.findByUserId(user.getId());
    }
}
