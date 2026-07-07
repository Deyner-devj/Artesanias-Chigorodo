package com.artesaniaschigorodo.domain.ports.out;

import com.artesaniaschigorodo.domain.models.client.User;

public interface JwtTokenPort {
    String generateToken(User user);
}

