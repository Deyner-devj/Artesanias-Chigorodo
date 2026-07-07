package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.request.LoginRequest;
import com.artesaniaschigorodo.application.adapters.api.request.RegisterRequest;
import com.artesaniaschigorodo.application.adapters.api.response.AuthResponse;
import com.artesaniaschigorodo.domain.models.User;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.ports.in.AuthUseCase;
import com.artesaniaschigorodo.domain.ports.out.UserPersistencePort;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthUseCase authUseCase;
    private final UserPersistencePort userPersistencePort;

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest request) {
        Role role = Role.CLIENT;
        if (request.getRole() != null) {
            try {
                role = Role.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                // Default to CLIENT if invalid role name provided
            }
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(role)
                .build();

        User registeredUser = authUseCase.register(user);
        
        // Hide password in response
        registeredUser.setPassword(null);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        String token = authUseCase.login(request.getEmail(), request.getPassword());
        User user = userPersistencePort.findByEmail(request.getEmail()).orElseThrow();

        AuthResponse response = AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();

        return ResponseEntity.ok(response);
    }
}
