package com.artesaniaschigorodo.application.useCases;

import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.models.order.Order;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.models.enums.OrderStatus;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.ports.in.GetArtisanOrdersPort;
import com.artesaniaschigorodo.domain.ports.out.OrderPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetArtisanOrdersUseCase implements GetArtisanOrdersPort {

    private final OrderPort orderPersistencePort;

    @Override
    public List<Order> getOrdersByArtisan(User artisan) {
        validateArtisanRole(artisan);
        
        // Obtener todos los pedidos que contienen productos del artesano
        List<Order> allOrders = orderPersistencePort.findBySellerIdOrderByCreatedAtDesc(artisan.getId());
        
        // Filtrar items para que solo muestre los del artesano
        return allOrders.stream()
                .map(order -> {
                    // Filtrar items que pertenecen al artesano
                    order.setItems(order.getItems().stream()
                            .filter(item -> artisan.getId().equals(item.getProduct().getSellerId()))
                            .collect(Collectors.toList()));
                    return order;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<Order> getOrdersByArtisanAndStatus(User artisan, String status) {
        validateArtisanRole(artisan);
        
        try {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            List<Order> allOrders = orderPersistencePort.findBySellerIdAndStatusOrderByCreatedAtDesc(
                    artisan.getId(), orderStatus.name());
            
            // Filtrar items para que solo muestre los del artesano
            return allOrders.stream()
                    .map(order -> {
                        order.setItems(order.getItems().stream()
                                .filter(item -> artisan.getId().equals(item.getProduct().getSellerId()))
                                .collect(Collectors.toList()));
                        return order;
                    })
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new ForbiddenOperationException("Estado de pedido inválido: " + status);
        }
    }

    private void validateArtisanRole(User user) {
        if (user.getRole() != Role.VENDOR && user.getRole() != Role.ADMIN) {
            throw new ForbiddenOperationException("Solo artesanos y administradores pueden acceder a esta funcionalidad");
        }
    }
}
