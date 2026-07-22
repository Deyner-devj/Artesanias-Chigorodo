package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.response.CategoryResponse;
import com.artesaniaschigorodo.domain.models.enums.Category;
import com.artesaniaschigorodo.domain.ports.out.CategoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryPort CategoryPort;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> listCategories() {
        List<CategoryResponse> categories = CategoryPort.findAll().stream()
                .map(category -> CategoryResponse.builder()
                        .code(category.getCode())
                        .name(category.getName())
                        .description(category.getDescription())
                        .build())
                .collect(Collectors.toList());

        if (categories.isEmpty()) {
            categories = Arrays.stream(Category.values())
                    .map(category -> CategoryResponse.builder()
                            .code(category.name())
                            .name(toSpanishName(category))
                            .description(toSpanishDescription(category))
                            .build())
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(categories);
    }

    private String toSpanishName(Category category) {
        return switch (category) {
            case TEXTILES -> "Tejidos";
            case CERAMICS -> "Cerámica";
            case JEWELRY -> "Joyería";
            case WOODWORK -> "Madera";
            case HOME_DECOR -> "Hogar y Decoración";
            case ACCESSORIES -> "Accesorios";
        };
    }

    private String toSpanishDescription(Category category) {
        return switch (category) {
            case TEXTILES -> "Piezas tejidas a mano por artesanos colombianos.";
            case CERAMICS -> "Artesanías en barro y cerámica de acabado único.";
            case JEWELRY -> "Joyería artesanal elaborada con detalle.";
            case WOODWORK -> "Trabajos en madera tallada y decorativa.";
            case HOME_DECOR -> "Decoración artesanal para el hogar.";
            case ACCESSORIES -> "Accesorios hechos a mano para uso diario.";
        };
    }
}
