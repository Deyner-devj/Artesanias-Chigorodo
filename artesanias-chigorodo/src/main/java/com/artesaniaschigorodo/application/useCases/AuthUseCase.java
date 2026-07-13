package com.artesaniaschigorodo.application.useCases;

import com.artesaniaschigorodo.domain.exceptions.ConflictException;
import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.exceptions.BusinessException;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.models.enums.UserStatus;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.in.AuthPortIn;
import com.artesaniaschigorodo.domain.ports.out.JwtTokenPort;
import com.artesaniaschigorodo.domain.ports.out.PasswordEncoderPort;
import com.artesaniaschigorodo.domain.ports.out.UserPortOut;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthUseCase implements AuthPortIn {

    private final UserPortOut userPersistencePort;
    private final PasswordEncoderPort passwordEncoderPort;
    private final JwtTokenPort jwtTokenPort;

    @Override
    public User register(User user) {
        if (userPersistencePort.existsByEmail(user.getEmail())) {
            throw new ConflictException("El correo electrónico ya está en uso.");
        }

        user.setPassword(passwordEncoderPort.encode(user.getPassword()));
        
        if (user.getRole() == null) {
            user.setRole(Role.CLIENT);
        }
        user.setStatus(UserStatus.ACTIVE);

        return userPersistencePort.save(user);
    }

    @Override
    public String login(String email, String password) {
        User user = userPersistencePort.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con el correo provisto."));

        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new BusinessException("La cuenta de usuario está desactivada.");
        }

        if (!passwordEncoderPort.matches(password, user.getPassword())) {
            throw new BusinessException("Credenciales de inicio de sesión incorrectas.");
        }

        return jwtTokenPort.generateToken(user);
    }
}

