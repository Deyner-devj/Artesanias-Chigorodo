package com.artesaniaschigorodo.infrastructure.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Enumeration;
import java.util.UUID;

@Component
@Slf4j
public class RequestResponseLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestId = UUID.randomUUID().toString();
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String queryString = request.getQueryString();

        long startTime = System.currentTimeMillis();

        log.info("[{}] → {} {} {}", requestId, method, uri, queryString != null ? "?" + queryString : "");
        logHeaders(requestId, request);

        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            int status = response.getStatus();

            if (status >= 400) {
                log.warn("[{}] ✗ {} {} - Status: {} ({}ms)", requestId, method, uri, status, duration);
            } else {
                log.info("[{}] ✓ {} {} - Status: {} ({}ms)", requestId, method, uri, status, duration);
            }
        }
    }

    private void logHeaders(String requestId, HttpServletRequest request) {
        Enumeration<String> headerNames = request.getHeaderNames();
        StringBuilder headers = new StringBuilder();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            if (!headerName.toLowerCase().equals("password") && !headerName.toLowerCase().contains("auth")) {
                String headerValue = request.getHeader(headerName);
                headers.append(headerName).append("=").append(headerValue).append("; ");
            }
        }
        if (headers.length() > 0) {
            log.debug("[{}] Headers: {}", requestId, headers);
        }
    }
}
