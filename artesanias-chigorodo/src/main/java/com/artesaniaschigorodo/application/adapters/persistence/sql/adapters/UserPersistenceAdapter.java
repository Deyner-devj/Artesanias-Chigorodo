package com.artesaniaschigorodo.application.adapters.persistence.sql.adapters;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.UserEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.mappers.UserMapper;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.UserJpaRepository;
import com.artesaniaschigorodo.domain.models.User;
import com.artesaniaschigorodo.domain.ports.out.UserPersistencePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UserPersistenceAdapter implements UserPersistencePort {

    private final UserJpaRepository userJpaRepository;

    @Override
    public Optional<User> findById(Long id) {
        return userJpaRepository.findById(id).map(UserMapper::toDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userJpaRepository.findByEmail(email).map(UserMapper::toDomain);
    }

    @Override
    public User save(User user) {
        UserEntity entity = UserMapper.toEntity(user);
        UserEntity savedEntity = userJpaRepository.save(entity);
        return UserMapper.toDomain(savedEntity);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userJpaRepository.existsByEmail(email);
    }
}
