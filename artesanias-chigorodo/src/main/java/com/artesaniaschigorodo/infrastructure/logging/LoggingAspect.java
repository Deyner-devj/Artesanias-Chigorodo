package com.artesaniaschigorodo.infrastructure.logging;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Pointcut("execution(* com.artesaniaschigorodo.application.adapters.api.controllers.*.*(..))")
    public void controllerMethods() {}

    @Pointcut("execution(* com.artesaniaschigorodo.application.useCases.*.*(..))")
    public void useCaseMethods() {}

    @Pointcut("execution(* com.artesaniaschigorodo.application.adapters.persistence.sql.adapters.*.*(..))")
    public void persistenceMethods() {}

    @Around("controllerMethods() || useCaseMethods() || persistenceMethods()")
    public Object logMethodExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        Object[] args = joinPoint.getArgs();

        log.info("→ [{}] {}", className, methodName);
        if (args.length > 0) {
            log.debug("  Argumentos: {}", formatArgs(args));
        }

        long startTime = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;
            log.info("✓ [{}] {} completado en {}ms", className, methodName, duration);
            return result;
        } catch (Exception ex) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("✗ [{}] {} falló en {}ms: {}", className, methodName, duration, ex.getMessage(), ex);
            throw ex;
        }
    }

    @AfterThrowing(pointcut = "controllerMethods()", throwing = "ex")
    public void logControllerException(JoinPoint joinPoint, Exception ex) {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        log.error("✗ CONTROLADOR ERROR [{}] {}: {}", className, methodName, ex.getMessage(), ex);
    }

    private String formatArgs(Object[] args) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < args.length; i++) {
            if (args[i] != null) {
                sb.append(args[i].getClass().getSimpleName()).append("(").append(args[i]).append(")");
            } else {
                sb.append("null");
            }
            if (i < args.length - 1) {
                sb.append(", ");
            }
        }
        return sb.toString();
    }
}
