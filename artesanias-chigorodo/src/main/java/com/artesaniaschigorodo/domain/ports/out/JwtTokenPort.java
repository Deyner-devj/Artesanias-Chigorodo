package com.artesaniaschigorodo.domain.ports.out;

import com.artesaniaschigorodo.domain.models.user.User;

public interface JwtTokenPort {
    String generateToken(User user);
}

