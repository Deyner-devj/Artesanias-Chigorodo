package com.artesaniaschigorodo.domain.ports.in;

import com.artesaniaschigorodo.domain.models.user.User;

public interface AuthPort {
    User register(User user);
    String login(String email, String password);
}

