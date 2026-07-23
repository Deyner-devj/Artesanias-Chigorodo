package com.artesaniaschigorodo.application.useCases;

import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.ports.in.ListProductPort;
import com.artesaniaschigorodo.domain.ports.out.ProductPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListProductUseCase implements ListProductPort {

    private final ProductPort productPersistencePort;

    @Override
    public List<Product> getAllProducts() {
        return productPersistencePort.findAll();
    }

    @Override
    public List<Product> getFilteredProducts(String category, Double minPrice, Double maxPrice, String search) {
        List<Product> products = productPersistencePort.findAll();
        return products.stream()
                .filter(p -> category == null || p.getCategory().name().equalsIgnoreCase(category))
                .filter(p -> minPrice == null || p.getPrice() >= minPrice)
                .filter(p -> maxPrice == null || p.getPrice() <= maxPrice)
                .filter(p -> search == null || p.getName().toLowerCase().contains(search.toLowerCase())
                        || p.getDescription().toLowerCase().contains(search.toLowerCase()))
                .collect(Collectors.toList());
    }
}
