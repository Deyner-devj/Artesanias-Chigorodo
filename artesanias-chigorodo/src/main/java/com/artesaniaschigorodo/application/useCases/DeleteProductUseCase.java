package com.artesaniaschigorodo.application.useCases;

import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.ports.in.DeleteProductPort;
import com.artesaniaschigorodo.domain.ports.out.ProductPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteProductUseCase implements DeleteProductPort {

    private final ProductPort productPersistencePort;

    @Override
    public void deleteProduct(Long id, User currentUser) {
        Product existingProduct = productPersistencePort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("El producto no existe."));

        if (currentUser.getRole() != Role.ADMIN && currentUser.getRole() != Role.VENDOR) {
            throw new ForbiddenOperationException("No tiene permisos para eliminar productos.");
        }

        if (currentUser.getRole() == Role.VENDOR && !currentUser.getId().equals(existingProduct.getSellerId())) {
            throw new ForbiddenOperationException("No puede eliminar un producto que no le pertenece.");
        }

        productPersistencePort.deleteById(id);
    }
}
