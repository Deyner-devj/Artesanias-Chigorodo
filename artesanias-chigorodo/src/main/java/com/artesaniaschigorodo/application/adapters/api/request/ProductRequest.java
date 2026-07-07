package com.artesaniaschigorodo.application.adapters.api.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ProductRequest {

    @NotBlank(message = "El nombre del producto es obligatorio.")
    private String name;

    private String description;

    @NotNull(message = "El precio es obligatorio.")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0.")
    private Double price;

    private String sellerName;

    private List<String> imageUrls;

    private List<String> colors;

    @NotBlank(message = "La categoría es obligatoria.")
    private String category; // Enum name

    @NotNull(message = "El stock disponible es obligatorio.")
    @Min(value = 0, message = "El stock no puede ser negativo.")
    private Integer stock;
}
