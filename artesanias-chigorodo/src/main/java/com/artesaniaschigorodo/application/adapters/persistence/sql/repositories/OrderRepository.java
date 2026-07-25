package com.artesaniaschigorodo.application.adapters.persistence.sql.repositories;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<OrderEntity> findAllByOrderByCreatedAtDesc();
    Optional<OrderEntity> findByOrderNumber(String orderNumber);

    /**
     * Busca pedidos que contienen productos de un vendedor específico en un rango de fechas.
     * Devuelve: total del pedido, product_id, cantidad
     */
    @Query("SELECT o.total, oi.product.id, oi.quantity " +
           "FROM OrderEntity o JOIN o.items oi JOIN oi.product p " +
           "WHERE p.sellerId = :sellerId " +
           "AND o.createdAt BETWEEN :startDate AND :endDate")
    List<Object[]> findOrdersBySellerIdAndDateRange(Long sellerId, Date startDate, Date endDate);

    /**
     * Busca todos los pedidos en un rango de fechas.
     * Devuelve: total, cantidad total, product_id
     */
    @Query("SELECT o.total, oi.quantity, oi.product.id " +
           "FROM OrderEntity o JOIN o.items oi " +
           "WHERE o.createdAt BETWEEN :startDate AND :endDate")
    List<Object[]> findAllOrdersInDateRange(Date startDate, Date endDate);

    /**
     * Busca pedidos con información del cliente para un vendedor específico.
     * Devuelve: customer_id, customer_name, customer_email, order_id, order_number, order_date, order_total
     */
    @Query("SELECT u.id, u.fullName, u.email, o.id, o.orderNumber, o.createdAt, o.total " +
           "FROM OrderEntity o JOIN o.items oi JOIN oi.product p JOIN o.user u " +
           "WHERE p.sellerId = :sellerId " +
           "GROUP BY u.id, u.fullName, u.email, o.id, o.orderNumber, o.createdAt, o.total " +
           "ORDER BY o.createdAt DESC")
    List<Object[]> findOrdersWithCustomerInfoBySellerId(Long sellerId);

    /**
     * Busca pedidos de un vendedor (para listar pedidos recibidos).
     */
    @Query("SELECT DISTINCT o FROM OrderEntity o JOIN o.items oi JOIN oi.product p " +
           "WHERE p.sellerId = :sellerId ORDER BY o.createdAt DESC")
    List<OrderEntity> findBySellerIdOrderByCreatedAtDesc(Long sellerId);

    /**
     * Busca pedidos de un vendedor por estado.
     */
    @Query("SELECT DISTINCT o FROM OrderEntity o JOIN o.items oi JOIN oi.product p " +
           "WHERE p.sellerId = :sellerId AND o.orderStatus = :status ORDER BY o.createdAt DESC")
    List<OrderEntity> findBySellerIdAndStatusOrderByCreatedAtDesc(Long sellerId, String status);
}


