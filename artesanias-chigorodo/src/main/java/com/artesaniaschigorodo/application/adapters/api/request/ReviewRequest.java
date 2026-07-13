package com.artesaniaschigorodo.application.adapters.api.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewRequest {

	@NotNull(message = "El ID del producto es obligatorio.")
	private Long productId;

	@NotBlank(message = "El título de la reseña es obligatorio.")
	private String title;

	@NotBlank(message = "El comentario es obligatorio.")
	private String comment;

	@NotNull(message = "La calificación es obligatoria.")
	@Min(value = 1, message = "La calificación mínima es 1.")
	@Max(value = 5, message = "La calificación máxima es 5.")
	private Integer rating;
}
