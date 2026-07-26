package com.artesaniaschigorodo.infrastructure.config;

import com.artesaniaschigorodo.domain.ports.in.AuthPort;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * TokenPrinter: Genera e imprime en consola el JWT del usuario admin al iniciar.
 * SEGURIDAD: Restringido al perfil "dev". Nunca activo en producción.
 *
 * Para activar: spring.profiles.active=dev en application.properties (solo desarrollo local)
 * Las credenciales se obtienen de variables de entorno:
 * - DEV_ADMIN_EMAIL: correo del admin para desarrollo
 * - DEV_ADMIN_PASSWORD: contraseña del admin para desarrollo
 */
@Component
@Profile("dev")
@RequiredArgsConstructor
public class TokenPrinter implements CommandLineRunner {

    private final AuthPort AuthPort;
    
    @Value("${dev.admin.email:}")
    private String devAdminEmail;
    
    @Value("${dev.admin.password:}")
    private String devAdminPassword;

    @Override
    public void run(String... args) throws Exception {
        if (devAdminEmail == null || devAdminEmail.isEmpty() || 
            devAdminPassword == null || devAdminPassword.isEmpty()) {
            System.out.println("TokenPrinter [DEV]: No se pueden generar tokens sin credenciales de desarrollo. " +
                               "Configura dev.admin.email y dev.admin.password en application.properties");
            return;
        }
        
        try {
            String token = AuthPort.login(devAdminEmail, devAdminPassword);
            System.out.println("TokenPrinter [DEV]: JWT for " + devAdminEmail + " -> " + token);
        } catch (Exception e) {
            System.out.println("TokenPrinter [DEV]: no se pudo generar token: " + e.getMessage());
        }
    }
}
