package com.artesaniaschigorodo.application.adapters.persistence.sql.adapters;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.CategoryEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.mappers.CategoryMapper;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.CategoryRepository;
import com.artesaniaschigorodo.domain.models.category.Category;
import com.artesaniaschigorodo.domain.ports.out.CategoryPortOut;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CategoryPersistenceAdapter implements CategoryPortOut {

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll().stream()
                .map(CategoryMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Category> findByCode(String code) {
        return categoryRepository.findByCode(code).map(CategoryMapper::toDomain);
    }

    @Override
    public Category save(Category category) {
        CategoryEntity entity = CategoryMapper.toEntity(category);
        CategoryEntity saved = categoryRepository.save(entity);
        return CategoryMapper.toDomain(saved);
    }
}
