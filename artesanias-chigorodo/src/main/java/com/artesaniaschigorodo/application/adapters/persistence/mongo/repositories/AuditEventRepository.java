package com.artesaniaschigorodo.application.adapters.persistence.mongo.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.artesaniaschigorodo.application.adapters.persistence.mongo.documents.AuditEventDocument;

public interface AuditEventRepository extends MongoRepository<AuditEventDocument, String> {
    List<AuditEventDocument> findTop100ByOrderByOccurredAtDesc();
}
