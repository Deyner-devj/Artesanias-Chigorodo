package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.request.AddressRequest;
import com.artesaniaschigorodo.application.adapters.api.response.AddressResponse;
import com.artesaniaschigorodo.application.useCases.AddressUseCase;
import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.user.Address;
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
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressUseCase addressUseCase;
    private final UserPort userPersistencePort;

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getAllAddresses() {
        User currentUser = getCurrentUser();
        List<Address> addresses = addressUseCase.getAddressesByUserId(currentUser.getId());
        List<AddressResponse> responses = addresses.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressResponse> getAddressById(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        Address address = addressUseCase.getAddressById(id, currentUser.getId());
        return ResponseEntity.ok(mapToResponse(address));
    }

    @GetMapping("/default")
    public ResponseEntity<AddressResponse> getDefaultAddress() {
        User currentUser = getCurrentUser();
        Address address = addressUseCase.getDefaultAddress(currentUser.getId());
        if (address == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(mapToResponse(address));
    }

    @PostMapping
    public ResponseEntity<AddressResponse> createAddress(@Valid @RequestBody AddressRequest request) {
        User currentUser = getCurrentUser();
        Address address = mapToDomain(request);
        Address created = addressUseCase.createAddress(address, currentUser.getId());
        return ResponseEntity.ok(mapToResponse(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long id, 
            @Valid @RequestBody AddressRequest request) {
        User currentUser = getCurrentUser();
        Address address = mapToDomain(request);
        Address updated = addressUseCase.updateAddress(id, address, currentUser.getId());
        return ResponseEntity.ok(mapToResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        addressUseCase.deleteAddress(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/default")
    public ResponseEntity<AddressResponse> setDefaultAddress(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        Address address = addressUseCase.setDefaultAddress(id, currentUser.getId());
        return ResponseEntity.ok(mapToResponse(address));
    }

    private Address mapToDomain(AddressRequest request) {
        return Address.builder()
                .recipientName(request.getRecipientName())
                .addressLine(request.getAddressLine())
                .neighborhood(request.getNeighborhood())
                .city(request.getCity())
                .department(request.getDepartment())
                .country(request.getCountry())
                .postalCode(request.getPostalCode())
                .telephone(request.getTelephone())
                .addressType(request.getAddressType())
                .isDefault(request.isDefault())
                .build();
    }

    private AddressResponse mapToResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .userId(address.getUserId())
                .recipientName(address.getRecipientName())
                .addressLine(address.getAddressLine())
                .neighborhood(address.getNeighborhood())
                .city(address.getCity())
                .department(address.getDepartment())
                .country(address.getCountry())
                .postalCode(address.getPostalCode())
                .telephone(address.getTelephone())
                .isDefault(address.isDefault())
                .addressType(address.getAddressType())
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
