package com.artesaniaschigorodo.domain.exceptions;

public class ForbiddenOperationException extends DomainException {
    public ForbiddenOperationException(String message) {
        super(message);
    }
}

