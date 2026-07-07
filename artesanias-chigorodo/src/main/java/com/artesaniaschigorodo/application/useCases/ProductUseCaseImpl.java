package com.artesaniaschigorodo.application.useCases;

import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.models.client.User;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.ports.in.ProductUseCase;
import com.artesaniaschigorodo.domain.ports.out.ProductPersistencePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductUseCaseImpl implements ProductUseCase {

    private final ProductPersistencePort productPersistencePort;

    @Override
    public Product getProductById(Long id) {
        return productPersistencePort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("El producto no existe."));
    }

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
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public Product createProduct(Product product, User currentUser) {
        validateWritePermission(currentUser);

        // VENDOR is forced to be the seller of their own product
        if (currentUser.getRole() == Role.VENDOR) {
            product.setSellerId(currentUser.getId());
            product.setSellerName(currentUser.getFullName());
        } else {
            if (product.getSellerId() == null) {
                product.setSellerId(currentUser.getId());
            }
            if (product.getSellerName() == null) {
                product.setSellerName(currentUser.getFullName());
            }
        }

        // Initialize defaults if null
        if (product.getRating() == null) product.setRating(5.0);
        if (product.getReviewsCount() == null) product.setReviewsCount(0);

        return productPersistencePort.save(product);
    }

    @Override
    public Product updateProduct(Long id, Product product, User currentUser) {
        validateWritePermission(currentUser);
        
        Product existingProduct = getProductById(id);
        validateOwnership(existingProduct, currentUser);

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setStock(product.getStock());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setImageUrls(product.getImageUrls());
        existingProduct.setColors(product.getColors());

        // VENDOR cannot change seller to someone else
        if (currentUser.getRole() != Role.ADMIN) {
            existingProduct.setSellerId(currentUser.getId());
            existingProduct.setSellerName(currentUser.getFullName());
        } else {
            if (product.getSellerId() != null) {
                existingProduct.setSellerId(product.getSellerId());
            }
            if (product.getSellerName() != null) {
                existingProduct.setSellerName(product.getSellerName());
            }
        }

        return productPersistencePort.save(existingProduct);
    }

    @Override
    public void deleteProduct(Long id, User currentUser) {
        validateWritePermission(currentUser);
        Product existingProduct = getProductById(id);
        validateOwnership(existingProduct, currentUser);

        productPersistencePort.deleteById(id);
    }

    private void validateWritePermission(User user) {
        if (user.getRole() != Role.ADMIN && user.getRole() != Role.VENDOR) {
            throw new ForbiddenOperationException("No tiene permisos para gestionar productos. Solo administradores y artesanos pueden hacerlo.");
        }
    }

    private void validateOwnership(Product product, User user) {
        if (user.getRole() == Role.VENDOR && !user.getId().equals(product.getSellerId())) {
            throw new ForbiddenOperationException("No puede modificar o eliminar un producto que pertenece a otro artesano.");
        }
    }
}

