package com.artesaniaschigorodo.domain.ports.out;

import com.artesaniaschigorodo.domain.models.category.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryPort {
    List<Category> findAll();
    Optional<Category> findByCode(String code);
    Category save(Category category);
}
