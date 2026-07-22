package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.response.DashboardResponse;
import com.artesaniaschigorodo.application.useCases.GetArtisanDashboardUseCase;
import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.out.UserPort;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

	private final GetArtisanDashboardUseCase dashboardUseCase;
	private final UserPort userPersistencePort;

	@GetMapping("/resumen")
	public ResponseEntity<DashboardResponse> getDashboardSummary() {
		User currentUser = getCurrentUser();
		return ResponseEntity.ok(dashboardUseCase.getDashboard(currentUser));
	}

	private User getCurrentUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			throw new ForbiddenOperationException("Debe iniciar sesión para ver el panel.");
		}
		String email = authentication.getName();
		return userPersistencePort.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Usuario actual no encontrado en el sistema."));
	}
}
