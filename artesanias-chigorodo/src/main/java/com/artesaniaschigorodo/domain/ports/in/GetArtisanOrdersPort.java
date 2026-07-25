package com.artesaniaschigorodo.domain.ports.in;

import com.artesaniaschigorodo.domain.models.order.Order;
import com.artesaniaschigorodo.domain.models.user.User;

import java.util.List;

/**
 * Puerto para obtener los pedidos recibidos por un artesano.
 */
public interface GetArtisanOrdersPort {

    /**
     * Obtiene todos los pedidos recibidos por un artesano (pedidos que contienen sus productos).
     * @param artisan User del artesano
     * @return Lista de pedidos del artesano
     */
    List<Order> getOrdersByArtisan(User artisan);

    /**
     * Obtiene los pedidos de un artesano filtrados por estado.
     * @param artisan User del artesano
     * @param status Estado del pedido
     * @return Lista de pedidos filtrados
     */
    List<Order> getOrdersByArtisanAndStatus(User artisan, String status);
}
