package com.artesaniaschigorodo.domain.ports.out;

import com.artesaniaschigorodo.domain.models.client.User;

import java.util.Optional;

public interface UserPersistencePort {
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    User save(User user);
    boolean existsByEmail(String email);
}

