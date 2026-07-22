package com.artesaniaschigorodo.application.adapters.persistence.sql.adapters;

import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.ports.out.ProductPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Component
@RequiredArgsConstructor
public class ProductPersistenceAdapter implements ProductPort {

	private final Map<Long, Product> products = new LinkedHashMap<>();
	private final AtomicLong sequence = new AtomicLong(1L);

	@Override
	public Optional<Product> findById(Long id) {
		return Optional.ofNullable(products.get(id));
	}

	@Override
	public Optional<Product> findByIdForUpdate(Long id) {
		return findById(id);
	}

	@Override
	public List<Product> findAll() {
		return new ArrayList<>(products.values());
	}

	@Override
	public Product save(Product product) {
		if (product.getId() == null) {
			product.setId(sequence.getAndIncrement());
		}
		products.put(product.getId(), product);
		return product;
	}

	@Override
	public void deleteById(Long id) {
		products.remove(id);
	}
}
