package com.artesaniaschigorodo.domain.ports.out;

import com.artesaniaschigorodo.domain.models.product.Product;
import java.util.List;

public interface GetArtisanProductsPort {
    List<Product> getProductsBySellerId(Long sellerId);
}