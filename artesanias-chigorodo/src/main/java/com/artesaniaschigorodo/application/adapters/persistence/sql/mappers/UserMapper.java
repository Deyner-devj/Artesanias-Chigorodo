package com.artesaniaschigorodo.application.adapters.persistence.sql.mappers;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.UserEntity;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.models.enums.UserStatus;
import com.artesaniaschigorodo.domain.models.user.User;

public class UserMapper {

    public static UserEntity toEntity(User domain) {
        if (domain == null) return null;
        return UserEntity.builder()
                .id(domain.getId())
                .fullName(domain.getFullName())
                .email(domain.getEmail())
                .password(domain.getPassword())
                .role(domain.getRole() != null ? domain.getRole().name() : null)
                .status(domain.getStatus() != null ? domain.getStatus().name() : null)
                .build();
    }

    public static User toDomain(UserEntity entity) {
        if (entity == null) return null;
        return User.builder()
                .id(entity.getId())
                .fullName(entity.getFullName())
                .email(entity.getEmail())
                .password(entity.getPassword())
                .role(entity.getRole() != null ? Role.valueOf(entity.getRole()) : null)
                .status(entity.getStatus() != null ? UserStatus.valueOf(entity.getStatus()) : null)
                .build();
    }
}

