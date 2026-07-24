package com.artesaniaschigorodo.domain.exceptions;

public class DomainException extends RuntimeException {
    private final int statusCode;
    
    public DomainException(String message) {
        this(message, 400);
    }
    
    public DomainException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
    
    public int getStatusCode() {
        return statusCode;
    }
}

