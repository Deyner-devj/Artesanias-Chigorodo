package com.artesaniaschigorodo.domain.ports.out;

import com.artesaniaschigorodo.domain.models.User;

public interface JwtTokenPort {
    String generateToken(User user);
}
