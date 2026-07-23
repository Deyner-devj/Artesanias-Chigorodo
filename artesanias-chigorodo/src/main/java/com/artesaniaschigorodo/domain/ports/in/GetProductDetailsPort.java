package com.artesaniaschigorodo.domain.ports.in;

import com.artesaniaschigorodo.domain.models.product.Product;
import com.artesaniaschigorodo.domain.models.user.User;

public interface GetProductDetailsPort {
    Product getProductById(Long id);
    Product getProductWithReviews(Long id, User currentUser);
}
