package com.artesaniaschigorodo.application.useCases;

import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.ports.in.GetArtisanProductsPort;
import com.artesaniaschigorodo.domain.ports.out.ProductPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetArtisanProductsUseCase implements GetArtisanProductsPort {

    private final ProductPort productPersistencePort;

    @Override
    public List<Product> getProductsByArtisan(User artisan) {
        validateArtisanRole(artisan);
        
        return productPersistencePort.findBySellerId(artisan.getId());
    }

    @Override
    public Product getArtisanProductById(Long productId, User artisan) {
        validateArtisanRole(artisan);
        
        Product product = productPersistencePort.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        
        // Validar que el producto pertenece al artesano
        if (!product.getSellerId().equals(artisan.getId())) {
            throw new ForbiddenOperationException("No tiene permisos para acceder a este producto");
        }
        
        return product;
    }

    private void validateArtisanRole(User user) {
        if (user.getRole() != Role.VENDOR && user.getRole() != Role.ADMIN) {
            throw new ForbiddenOperationException("Solo artesanos y administradores pueden acceder a esta funcionalidad");
        }
    }
}
