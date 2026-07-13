package com.artesaniaschigorodo.infrastructure.config;

import com.artesaniaschigorodo.domain.ports.in.AuthPortIn;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TokenPrinter implements CommandLineRunner {

    private final AuthPortIn authPortIn;

    @Override
    public void run(String... args) throws Exception {
        try {
            String token = authPortIn.login("admin@example.com", "Admin123!");
            System.out.println("TokenPrinter: JWT for admin@example.com -> " + token);
        } catch (Exception e) {
            System.out.println("TokenPrinter: no se pudo generar token: " + e.getMessage());
        }
    }
}
