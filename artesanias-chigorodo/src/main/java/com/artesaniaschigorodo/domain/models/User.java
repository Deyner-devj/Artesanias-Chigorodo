package com.artesaniaschigorodo.domain.models;

import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.models.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long id;
    private String fullName;
    private String email;
    private String password;
    private Role role;
    private UserStatus status;
}
