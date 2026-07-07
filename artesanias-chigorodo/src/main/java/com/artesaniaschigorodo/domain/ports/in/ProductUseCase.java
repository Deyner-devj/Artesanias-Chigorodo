package com.artesaniaschigorodo.domain.ports.in;

import com.artesaniaschigorodo.domain.models.Product;
import com.artesaniaschigorodo.domain.models.User;

import java.util.List;

public interface ProductUseCase {
    Product getProductById(Long id);
    List<Product> getAllProducts();
    Product createProduct(Product product, User currentUser);
    Product updateProduct(Long id, Product product, User currentUser);
    void deleteProduct(Long id, User currentUser);
}
