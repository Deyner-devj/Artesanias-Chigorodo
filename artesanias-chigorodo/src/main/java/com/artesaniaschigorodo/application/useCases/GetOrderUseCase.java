package com.artesaniaschigorodo.application.useCases;

import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.order.Order;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.ports.in.GetOrderPort;
import com.artesaniaschigorodo.domain.ports.out.OrderPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetOrderUseCase implements GetOrderPort {

    private final OrderPort orderPersistencePort;

    @Override
    public Order getOrderByOrderNumber(String orderNumber, User currentUser) {
        Order order = orderPersistencePort.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("La orden no existe."));

        if (currentUser.getRole() == Role.CLIENT) {
            if (!order.getUser().getId().equals(currentUser.getId())) {
                throw new ForbiddenOperationException("No tiene permisos para ver esta orden.");
            }
        }

        return order;
    }

    @Override
    public List<Order> getOrdersForUser(User currentUser) {
        if (currentUser.getRole() == Role.CLIENT) {
            return orderPersistencePort.findByUserId(currentUser.getId());
        }
        return orderPersistencePort.findByUserId(null);
    }
}
