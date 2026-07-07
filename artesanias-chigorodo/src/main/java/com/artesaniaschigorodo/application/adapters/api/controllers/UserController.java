package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.request.UpdateProfileRequest;
import com.artesaniaschigorodo.application.adapters.api.response.UserResponse;
import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.client.User;
import com.artesaniaschigorodo.domain.ports.out.UserPersistencePort;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserPersistencePort userPersistencePort;

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

