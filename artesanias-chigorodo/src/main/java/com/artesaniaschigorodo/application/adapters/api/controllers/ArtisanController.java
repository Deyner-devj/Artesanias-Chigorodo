package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.response.UserResponse;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.models.enums.UserStatus;
import com.artesaniaschigorodo.domain.ports.out.UserPort;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Directorio publico. Nunca expone correo, contrasena ni datos privados. */
@RestController
@RequestMapping("/api/artisans")
@RequiredArgsConstructor
public class ArtisanController {
    private final UserPort users;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getActiveArtisans() {
        List<UserResponse> result = users.findAllByRole(Role.VENDOR).stream()
                .filter(user -> user.getStatus() == UserStatus.ACTIVE)
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .fullName(user.getFullName())
                        .role(user.getRole().name())
                        .status(user.getStatus().name())
                        .build())
                .toList();
        return ResponseEntity.ok(result);
    }
}
