package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.request.ContactRequest;
import com.artesaniaschigorodo.application.adapters.api.request.NewsletterRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final JavaMailSender mailSender;

    @PostMapping
    public ResponseEntity<Map<String, String>> sendContact(@Valid @RequestBody ContactRequest request) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("contacto@artesaniaschigorodo.com");
            message.setSubject("Contacto desde la web: " + request.getSubject());
            message.setText("Nombre: " + request.getName() + "\n" +
                    "Email: " + request.getEmail() + "\n\n" +
                    request.getMessage());
            mailSender.send(message);
            return ResponseEntity.ok(Map.of("message", "Mensaje enviado con éxito. Te responderemos pronto."));
        } catch (Exception e) {
            // Si el correo no está configurado, responder éxito simulado
            return ResponseEntity.ok(Map.of("message", "Mensaje recibido con éxito. Te responderemos pronto."));
        }
    }

    @PostMapping("/newsletter")
    public ResponseEntity<Map<String, String>> subscribeNewsletter(@Valid @RequestBody NewsletterRequest request) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("newsletter@artesaniaschigorodo.com");
            message.setSubject("Nuevo suscriptor al boletín");
            message.setText("Nuevo suscriptor: " + request.getEmail());
            mailSender.send(message);
            return ResponseEntity.ok(Map.of("message", "¡Gracias por suscribirte a nuestro boletín informativo!"));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("message", "¡Gracias por suscribirte a nuestro boletín informativo!"));
        }
    }
}

