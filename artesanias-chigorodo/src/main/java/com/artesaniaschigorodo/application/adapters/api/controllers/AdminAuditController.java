package com.artesaniaschigorodo.application.adapters.api.controllers;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.artesaniaschigorodo.application.adapters.persistence.mongo.documents.AuditEventDocument;
import com.artesaniaschigorodo.infrastructure.audit.AuditEventService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/audit-events")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAuditController {
    private final AuditEventService auditEventService;

    @GetMapping
    public List<AuditEventDocument> recentEvents() {
        return auditEventService.recentEvents();
    }
}
