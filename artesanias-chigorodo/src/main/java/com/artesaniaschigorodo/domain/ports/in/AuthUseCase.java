package com.artesaniaschigorodo.domain.ports.in;

import com.artesaniaschigorodo.domain.models.User;

public interface AuthUseCase {
    User register(User user);
    String login(String email, String password);
}
