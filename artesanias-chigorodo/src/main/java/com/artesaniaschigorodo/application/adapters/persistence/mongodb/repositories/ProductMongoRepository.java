package com.artesaniaschigorodo.application.adapters.persistence.mongodb.repositories;

import com.artesaniaschigorodo.application.adapters.persistence.mongodb.documents.ProductDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductMongoRepository extends MongoRepository<ProductDocument, Long> {
}
