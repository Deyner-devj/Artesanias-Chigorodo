package com.artesaniaschigorodo.application.adapters.persistence.mongodb.adapters;

import com.artesaniaschigorodo.application.adapters.persistence.mongodb.documents.ProductDocument;
import com.artesaniaschigorodo.application.adapters.persistence.mongodb.mappers.ProductMongoMapper;
import com.artesaniaschigorodo.application.adapters.persistence.mongodb.repositories.ProductMongoRepository;
import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.ports.out.ProductPersistencePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductMongoPersistenceAdapter implements ProductPersistencePort {

    private final ProductMongoRepository productMongoRepository;

    @Override
    public Optional<Product> findById(Long id) {
        return productMongoRepository.findById(id).map(ProductMongoMapper::toDomain);
    }

    @Override
    public Optional<Product> findByIdForUpdate(Long id) {
        return findById(id);
    }

    @Override
    public List<Product> findAll() {
        return productMongoRepository.findAll().stream()
                .map(ProductMongoMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Product save(Product product) {
        ProductDocument doc = ProductMongoMapper.toDocument(product);
        ProductDocument saved = productMongoRepository.save(doc);
        return ProductMongoMapper.toDomain(saved);
    }

    @Override
    public void deleteById(Long id) {
        productMongoRepository.deleteById(id);
    }
}
