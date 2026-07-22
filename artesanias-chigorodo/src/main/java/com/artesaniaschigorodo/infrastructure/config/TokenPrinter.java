package com.artesaniaschigorodo.infrastructure.config;

import com.artesaniaschigorodo.domain.ports.in.AuthPort;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * TokenPrinter: Genera e imprime en consola el JWT del usuario admin al iniciar.
 * SEGURIDAD: Restringido al perfil "dev". Nunca activo en producción.
 *
 * Para activar: spring.profiles.active=dev en application.properties (solo desarrollo local)
 */
@Component
@Profile("dev")
@RequiredArgsConstructor
public class TokenPrinter implements CommandLineRunner {

    private final AuthPort AuthPort;

    @Override
    public void run(String... args) throws Exception {
        try {
            String token = AuthPort.login("admin@example.com", "Admin123!");
            System.out.println("TokenPrinter [DEV]: JWT for admin@example.com -> " + token);
        } catch (Exception e) {
            System.out.println("TokenPrinter [DEV]: no se pudo generar token: " + e.getMessage());
        }
    }
}
