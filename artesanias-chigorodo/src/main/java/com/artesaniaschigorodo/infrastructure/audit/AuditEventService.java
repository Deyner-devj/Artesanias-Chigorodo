package com.artesaniaschigorodo.infrastructure.audit;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.artesaniaschigorodo.application.adapters.persistence.mongo.documents.AuditEventDocument;
import com.artesaniaschigorodo.application.adapters.persistence.mongo.repositories.AuditEventRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** MongoDB is observability-only: a failure here never interrupts a sale or login. */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuditEventService {
    private final AuditEventRepository repository;

    public void record(String eventType, String outcome, String actorEmail, Long actorUserId,
            String resourceType, String resourceId, Map<String, String> metadata) {
        try {
            repository.save(AuditEventDocument.builder()
                    .occurredAt(Instant.now())
                    .eventType(eventType)
                    .outcome(outcome)
                    .actorEmail(actorEmail == null ? null : actorEmail.trim().toLowerCase())
                    .actorUserId(actorUserId)
                    .resourceType(resourceType)
                    .resourceId(resourceId)
                    .metadata(metadata == null ? Map.of() : Map.copyOf(metadata))
                    .build());
        } catch (Exception ex) {
            log.warn("No fue posible registrar la auditoria MongoDB: {}", ex.getMessage());
        }
    }

    public List<AuditEventDocument> recentEvents() {
        return repository.findTop100ByOrderByOccurredAtDesc();
    }
}
