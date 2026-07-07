package com.artesaniaschigorodo.domain.ports.out;

import com.artesaniaschigorodo.domain.models.Product;

import java.util.List;
import java.util.Optional;

public interface ProductPersistencePort {
    Optional<Product> findById(Long id);
    Optional<Product> findByIdForUpdate(Long id);
    List<Product> findAll();
    Product save(Product product);
    void deleteById(Long id);
}
