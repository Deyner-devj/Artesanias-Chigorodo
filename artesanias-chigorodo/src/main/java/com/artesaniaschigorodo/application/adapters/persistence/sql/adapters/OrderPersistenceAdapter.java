package com.artesaniaschigorodo.application.adapters.persistence.sql.adapters;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.OrderEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.mappers.OrderMapper;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.OrderJpaRepository;
import com.artesaniaschigorodo.domain.models.order.Order;
import com.artesaniaschigorodo.domain.ports.out.OrderPersistencePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OrderPersistenceAdapter implements OrderPersistencePort {

    private final OrderJpaRepository orderJpaRepository;

    @Override
    public Optional<Order> findById(Long id) {
        return orderJpaRepository.findById(id).map(OrderMapper::toDomain);
    }

    @Override
    public Optional<Order> findByOrderNumber(String orderNumber) {
        return orderJpaRepository.findByOrderNumber(orderNumber).map(OrderMapper::toDomain);
    }

    @Override
    public List<Order> findByUserId(Long userId) {
        List<OrderEntity> entities;
        if (userId == null) {
            entities = orderJpaRepository.findAllByOrderByCreatedAtDesc();
        } else {
            entities = orderJpaRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }
        return entities.stream()
                .map(OrderMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Order save(Order order) {
        OrderEntity entity = OrderMapper.toEntity(order);
        
        // Link the item entities to the order correctly if Hibernate requires it,
        // but since we mapped items cascade, we must be careful with lazy loading and foreign key constraints.
        // The Mapper maps item entities which are saved cascadingly by JpaRepository.
        
        OrderEntity savedEntity = orderJpaRepository.save(entity);
        return OrderMapper.toDomain(savedEntity);
    }
}

