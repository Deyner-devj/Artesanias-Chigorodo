package com.artesaniaschigorodo.domain.ports.in;

import com.artesaniaschigorodo.domain.models.category.Category;
import java.util.List;

public interface ListCategoriesPort {
    List<Category> getAllCategories();
}
