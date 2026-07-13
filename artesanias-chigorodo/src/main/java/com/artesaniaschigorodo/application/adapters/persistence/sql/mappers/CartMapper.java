package com.artesaniaschigorodo.application.adapters.persistence.sql.mappers;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.CartEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.CartItemEntity;
import com.artesaniaschigorodo.domain.models.cart.Cart;
import com.artesaniaschigorodo.domain.models.cart.CartItem;
import com.artesaniaschigorodo.domain.models.product.Product;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class CartMapper {

    public static CartEntity toEntity(Cart domain) {
        if (domain == null) {
            return null;
        }
        List<CartItemEntity> itemEntities = new ArrayList<>();
        if (domain.getItems() != null) {
            itemEntities = domain.getItems().stream()
                    .map(CartMapper::toEntity)
                    .collect(Collectors.toList());
        }

        return CartEntity.builder()
                .id(domain.getId())
                .userEmail(domain.getUserEmail())
                .items(itemEntities)
                .totalQuantity(domain.getTotalQuantity())
                .subtotal(domain.getSubtotal())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }

    public static Cart toDomain(CartEntity entity) {
        if (entity == null) {
            return null;
        }
        List<CartItem> items = new ArrayList<>();
        if (entity.getItems() != null) {
            items = entity.getItems().stream()
                    .map(CartMapper::toDomain)
                    .collect(Collectors.toList());
        }

        return Cart.builder()
                .userEmail(entity.getUserEmail())
                .items(items)
                .totalQuantity(entity.getTotalQuantity())
                .subtotal(entity.getSubtotal())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private static CartItemEntity toEntity(CartItem item) {
        if (item == null) {
            return null;
        }
        return CartItemEntity.builder()
                .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                .productName(item.getProduct() != null ? item.getProduct().getName() : null)
                .sellerId(item.getProduct() != null ? item.getProduct().getSellerId() : null)
                .sellerName(item.getProduct() != null ? item.getProduct().getSellerName() : null)
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(item.getSubtotal())
                .build();
    }

    private static CartItem toDomain(CartItemEntity entity) {
        if (entity == null) {
            return null;
        }
        return CartItem.builder()
                .product(Product.builder()
                        .id(entity.getProductId())
                        .name(entity.getProductName())
                        .sellerId(entity.getSellerId())
                        .sellerName(entity.getSellerName())
                        .price(entity.getUnitPrice())
                        .build())
                .quantity(entity.getQuantity())
                .unitPrice(entity.getUnitPrice())
                .subtotal(entity.getSubtotal())
                .build();
    }
}
