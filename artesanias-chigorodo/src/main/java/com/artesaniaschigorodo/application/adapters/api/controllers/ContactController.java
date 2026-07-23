package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.request.ContactRequest;
import com.artesaniaschigorodo.application.adapters.api.request.NewsletterRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {
    private final JavaMailSender mailSender;

    @Value("${app.whatsapp.contact-number:573127658412}")
    private String whatsappContactNumber;

    @PostMapping
    public ResponseEntity<Map<String, String>> sendContact(@Valid @RequestBody ContactRequest request) {
        String text = "Nuevo contacto desde Artesanias Chigorodo\n\nNombre: " + request.getName()
                + "\nCorreo: " + request.getEmail() + "\nAsunto: " + request.getSubject()
                + "\nMensaje: " + request.getMessage();
        String url = "https://wa.me/" + whatsappContactNumber + "?text=" + URLEncoder.encode(text, StandardCharsets.UTF_8);
        return ResponseEntity.ok(Map.of("whatsappUrl", url));
    }

    @PostMapping("/newsletter")
    public ResponseEntity<Map<String, String>> subscribeNewsletter(@Valid @RequestBody NewsletterRequest request) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("newsletter@artesaniaschigorodo.com");
            message.setSubject("Nuevo suscriptor al boletin");
            message.setText("Nuevo suscriptor: " + request.getEmail());
            mailSender.send(message);
            return ResponseEntity.ok(Map.of("message", "Suscripcion registrada."));
        } catch (Exception exception) {
            return ResponseEntity.internalServerError().body(Map.of("message", "No fue posible completar la suscripcion."));
        }
    }
}
