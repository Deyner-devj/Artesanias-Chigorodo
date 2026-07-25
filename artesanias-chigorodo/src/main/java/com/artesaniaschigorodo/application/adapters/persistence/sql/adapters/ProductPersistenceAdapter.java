package com.artesaniaschigorodo.application.adapters.persistence.sql.adapters;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.ProductEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.mappers.ProductMapper;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.ProductRepository;
import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.ports.out.ProductPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductPersistenceAdapter implements ProductPort {

	private final ProductRepository productRepository;

	@Override
	public Optional<Product> findById(Long id) {
		return productRepository.findById(id).map(ProductMapper::toDomain);
	}

	@Override
	public Optional<Product> findByIdForUpdate(Long id) {
		return findById(id);
	}

	@Override
	public List<Product> findAll() {
		return productRepository.findAll().stream()
				.map(ProductMapper::toDomain)
				.collect(Collectors.toList());
	}

	@Override
	public List<Product> findBySellerId(Long sellerId) {
		return productRepository.findBySellerId(sellerId).stream()
				.map(ProductMapper::toDomain)
				.collect(Collectors.toList());
	}

	@Override
	public long countBySellerId(Long sellerId) {
		return productRepository.countBySellerId(sellerId);
	}

	@Override
	public Product save(Product product) {
		ProductEntity entity = ProductMapper.toEntity(product);
		ProductEntity saved = productRepository.save(entity);
		return ProductMapper.toDomain(saved);
	}

	@Override
	public void deleteById(Long id) {
		productRepository.deleteById(id);
	}
}
