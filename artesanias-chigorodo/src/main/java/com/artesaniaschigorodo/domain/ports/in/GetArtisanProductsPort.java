package com.artesaniaschigorodo.domain.ports.in;

import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.models.user.User;

import java.util.List;

/**
 * Puerto para obtener los productos de un artesano.
 */
public interface GetArtisanProductsPort {

    /**
     * Obtiene todos los productos de un artesano específico.
     * @param artisan User del artesano
     * @return Lista de productos del artesano
     */
    List<Product> getProductsByArtisan(User artisan);

    /**
     * Obtiene un producto específico de un artesano, validando propiedad.
     * @param productId ID del producto
     * @param artisan User del artesano
     * @return Producto si pertenece al artesano
     */
    Product getArtisanProductById(Long productId, User artisan);
}
