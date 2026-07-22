package com.artesaniaschigorodo.domain.services;

import com.artesaniaschigorodo.domain.exceptions.ConflictException;

public class ValidateUniqueEmail {

    public void validate(boolean exists) {
        if (exists) {
            throw new ConflictException("El correo electrónico ya se encuentra registrado en el sistema");
        }
    }
}
