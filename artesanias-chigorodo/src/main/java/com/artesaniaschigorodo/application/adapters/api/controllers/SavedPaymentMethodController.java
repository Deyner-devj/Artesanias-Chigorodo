package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.request.SavedPaymentMethodRequest;
import com.artesaniaschigorodo.application.adapters.api.response.SavedPaymentMethodResponse;
import com.artesaniaschigorodo.application.useCases.SavedPaymentMethodUseCase;
import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.enums.PaymentMethod;
import com.artesaniaschigorodo.domain.models.user.SavedPaymentMethod;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.out.UserPort;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
public class SavedPaymentMethodController {

    private final SavedPaymentMethodUseCase paymentMethodUseCase;
    private final UserPort userPersistencePort;

    @GetMapping
    public ResponseEntity<List<SavedPaymentMethodResponse>> getAllPaymentMethods() {
        User currentUser = getCurrentUser();
        List<SavedPaymentMethod> paymentMethods = paymentMethodUseCase.getPaymentMethodsByUserId(currentUser.getId());
        List<SavedPaymentMethodResponse> responses = paymentMethods.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SavedPaymentMethodResponse> getPaymentMethodById(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        SavedPaymentMethod paymentMethod = paymentMethodUseCase.getPaymentMethodById(id, currentUser.getId());
        return ResponseEntity.ok(mapToResponse(paymentMethod));
    }

    @GetMapping("/default")
    public ResponseEntity<SavedPaymentMethodResponse> getDefaultPaymentMethod() {
        User currentUser = getCurrentUser();
        SavedPaymentMethod paymentMethod = paymentMethodUseCase.getDefaultPaymentMethod(currentUser.getId());
        if (paymentMethod == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(mapToResponse(paymentMethod));
    }

    @PostMapping
    public ResponseEntity<SavedPaymentMethodResponse> createPaymentMethod(@Valid @RequestBody SavedPaymentMethodRequest request) {
        User currentUser = getCurrentUser();
        SavedPaymentMethod paymentMethod = mapToDomain(request);
        SavedPaymentMethod created = paymentMethodUseCase.createPaymentMethod(paymentMethod, currentUser.getId());
        return ResponseEntity.ok(mapToResponse(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SavedPaymentMethodResponse> updatePaymentMethod(
            @PathVariable Long id, 
            @Valid @RequestBody SavedPaymentMethodRequest request) {
        User currentUser = getCurrentUser();
        SavedPaymentMethod paymentMethod = mapToDomain(request);
        SavedPaymentMethod updated = paymentMethodUseCase.updatePaymentMethod(id, paymentMethod, currentUser.getId());
        return ResponseEntity.ok(mapToResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentMethod(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        paymentMethodUseCase.deletePaymentMethod(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/default")
    public ResponseEntity<SavedPaymentMethodResponse> setDefaultPaymentMethod(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        SavedPaymentMethod paymentMethod = paymentMethodUseCase.setDefaultPaymentMethod(id, currentUser.getId());
        return ResponseEntity.ok(mapToResponse(paymentMethod));
    }

    private SavedPaymentMethod mapToDomain(SavedPaymentMethodRequest request) {
        return SavedPaymentMethod.builder()
                .cardType(request.getCardType() != null ? PaymentMethod.valueOf(request.getCardType().toUpperCase()) : null)
                .cardNumber(request.getCardNumber())
                .cardHolderName(request.getCardHolderName())
                .expiryDate(request.getExpiryDate())
                .cvv(request.getCvv())
                .isDefault(request.isDefault())
                .build();
    }

    private SavedPaymentMethodResponse mapToResponse(SavedPaymentMethod paymentMethod) {
        return SavedPaymentMethodResponse.builder()
                .id(paymentMethod.getId())
                .userId(paymentMethod.getUserId())
                .cardType(paymentMethod.getCardType() != null ? paymentMethod.getCardType().name() : null)
                .lastFourDigits(paymentMethod.getLastFourDigits())
                .cardHolderName(paymentMethod.getCardHolderName())
                .expiryDate(paymentMethod.getExpiryDate())
                .isDefault(paymentMethod.isDefault())
                .build();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ForbiddenOperationException("Debe iniciar sesión para acceder a esta información.");
        }
        String email = authentication.getName();
        return userPersistencePort.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario actual no encontrado en el sistema."));
    }
}
