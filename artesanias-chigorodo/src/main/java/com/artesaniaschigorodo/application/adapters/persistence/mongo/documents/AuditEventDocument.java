package com.artesaniaschigorodo.application.adapters.persistence.mongo.documents;

import java.time.Instant;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Bitacora inmutable de seguridad y operaciones. No guarda contrasenas,
 * tokens, numeros de tarjeta ni cuerpos de solicitudes.
 */
@Document(collection = "audit_events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditEventDocument {
    @Id
    private String id;

    @Indexed
    private Instant occurredAt;

    @Indexed
    private String eventType;

    @Indexed
    private String outcome;

    @Indexed
    private String actorEmail;

    private Long actorUserId;
    private String resourceType;
    private String resourceId;
    private String ipAddress;
    private String userAgent;
    private String correlationId;
    private Map<String, String> metadata;
}
