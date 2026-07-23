package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.request.LoginRequest;
import com.artesaniaschigorodo.application.adapters.api.request.RegisterRequest;
import com.artesaniaschigorodo.application.adapters.api.response.AuthResponse;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.in.AuthPort;
import com.artesaniaschigorodo.domain.ports.out.UserPort;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import com.artesaniaschigorodo.application.adapters.api.request.ForgotPasswordRequest;
import com.artesaniaschigorodo.application.adapters.api.request.ResetPasswordRequest;
import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.PasswordResetTokenEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.PasswordResetTokenRepository;
import java.time.LocalDateTime;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthPort authUseCase;
    private final UserPort userPersistencePort;
    private final PasswordResetTokenRepository passwordResetTokens;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Value("${app.frontend-base-url:http://localhost:5500/frontend/home}")
    private String frontendBaseUrl;

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest request) {
        Role role = Role.CLIENT; // Always enforce CLIENT role on public registration to prevent privilege escalation

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

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        userPersistencePort.findByEmail(request.getEmail()).ifPresent(user -> {
            passwordResetTokens.deleteByUserId(user.getId());
            String token = newToken();
            passwordResetTokens.save(PasswordResetTokenEntity.builder().userId(user.getId()).token(token)
                    .expiresAt(LocalDateTime.now().plusMinutes(30)).build());
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Restablece tu contrasena");
            message.setText("Usa este enlace una sola vez dentro de 30 minutos: " + frontendBaseUrl + "/restablecer-contrasena.html?token=" + token);
            mailSender.send(message);
        });
        return ResponseEntity.ok(Map.of("message", "Si el correo existe, recibira un enlace para restablecer su contrasena."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        PasswordResetTokenEntity reset = passwordResetTokens.findByToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("El enlace de recuperacion no es valido."));
        if (reset.getUsedAt() != null || reset.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("El enlace de recuperacion ya expiro o fue utilizado.");
        }
        User user = userPersistencePort.findById(reset.getUserId()).orElseThrow();
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userPersistencePort.save(user);
        reset.setUsedAt(LocalDateTime.now());
        passwordResetTokens.save(reset);
        return ResponseEntity.ok(Map.of("message", "Contrasena actualizada. Ya puedes iniciar sesion."));
    }

    private String newToken() {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}

