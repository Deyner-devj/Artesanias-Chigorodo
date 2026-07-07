package com.artesaniaschigorodo.application.adapters.persistence.sql.adapters;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.ProductEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.mappers.ProductMapper;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.ProductJpaRepository;
import com.artesaniaschigorodo.domain.models.Product;
import com.artesaniaschigorodo.domain.ports.out.ProductPersistencePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductPersistenceAdapter implements ProductPersistencePort {

    private final ProductJpaRepository productJpaRepository;

    @Override
    public Optional<Product> findById(Long id) {
        return productJpaRepository.findById(id).map(ProductMapper::toDomain);
    }

    @Override
    public Optional<Product> findByIdForUpdate(Long id) {
        return productJpaRepository.findByIdForUpdate(id).map(ProductMapper::toDomain);
    }

    @Override
    public List<Product> findAll() {
        return productJpaRepository.findAll().stream()
                .map(ProductMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Product save(Product product) {
        ProductEntity entity = ProductMapper.toEntity(product);
        ProductEntity savedEntity = productJpaRepository.save(entity);
        return ProductMapper.toDomain(savedEntity);
    }

    @Override
    public void deleteById(Long id) {
        productJpaRepository.deleteById(id);
    }
}
