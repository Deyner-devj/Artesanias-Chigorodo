package com.artesaniaschigorodo.domain.ports.out;

import java.util.List;
import java.util.Optional;

import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.models.user.User;

public interface UserPort {
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    User save(User user);
    boolean existsByEmail(String email);
    List<User> findAll();
    List<User> findAllByRole(Role role);
}