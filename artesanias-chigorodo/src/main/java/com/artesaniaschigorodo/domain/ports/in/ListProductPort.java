package com.artesaniaschigorodo.domain.ports.in;

import com.artesaniaschigorodo.domain.models.product.Product;
import java.util.List;

public interface ListProductPort {
    List<Product> getAllProducts();
    List<Product> getFilteredProducts(String category, Double minPrice, Double maxPrice, String search);
}
