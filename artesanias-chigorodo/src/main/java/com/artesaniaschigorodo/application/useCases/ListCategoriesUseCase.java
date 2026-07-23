package com.artesaniaschigorodo.application.useCases;

import com.artesaniaschigorodo.domain.models.category.Category;
import com.artesaniaschigorodo.domain.ports.in.ListCategoriesPort;
import com.artesaniaschigorodo.domain.ports.out.CategoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListCategoriesUseCase implements ListCategoriesPort {

    private final CategoryPort categoryPersistencePort;

    @Override
    public List<Category> getAllCategories() {
        return categoryPersistencePort.findAll();
    }
}
