package com.artesaniaschigorodo.domain.ports.in;

import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.models.user.User;

public interface DeleteProductPort {
    void deleteProduct(Long id, User currentUser);
}
