package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.request.UpdateProfileRequest;
import com.artesaniaschigorodo.application.adapters.api.response.UserResponse;
import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.out.UserPort;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.models.enums.UserStatus;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserPort userPersistencePort;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getProfile() {
        User currentUser = getCurrentUser();
        return ResponseEntity.ok(mapToResponse(currentUser));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        User currentUser = getCurrentUser();
        currentUser.setFullName(request.getFullName());
        User updated = userPersistencePort.save(currentUser);
        return ResponseEntity.ok(mapToResponse(updated));
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        requireAdmin();
        return ResponseEntity.ok(userPersistencePort.findAll().stream().map(this::mapToResponse).toList());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<UserResponse> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        requireAdmin();
        User user = userPersistencePort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));
        try {
            user.setStatus(UserStatus.valueOf(body.getOrDefault("status", "").toUpperCase()));
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("Estado de usuario invalido.");
        }
        return ResponseEntity.ok(mapToResponse(userPersistencePort.save(user)));
    }

    private void requireAdmin() {
        if (getCurrentUser().getRole() != Role.ADMIN) {
            throw new ForbiddenOperationException("Solo un administrador puede gestionar usuarios.");
        }
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ForbiddenOperationException("Debe iniciar sesión para acceder a esta información.");
        }
        String email = authentication.getName();
        return userPersistencePort.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario actual no encontrado en el sistema."));
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .build();
    }
}

