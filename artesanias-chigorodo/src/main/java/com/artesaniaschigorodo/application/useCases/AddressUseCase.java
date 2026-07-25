package com.artesaniaschigorodo.application.useCases;

import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.user.Address;
import com.artesaniaschigorodo.domain.ports.out.AddressPort;
import com.artesaniaschigorodo.domain.ports.out.UserPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressUseCase {

    private final AddressPort addressPort;
    private final UserPort userPort;

    public List<Address> getAddressesByUserId(Long userId) {
        validateUserExists(userId);
        return addressPort.findByUserId(userId);
    }

    public Address getAddressById(Long addressId, Long userId) {
        Address address = addressPort.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Dirección no encontrada"));
        
        if (!address.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Dirección no encontrada para este usuario");
        }
        
        return address;
    }

    public Address createAddress(Address address, Long userId) {
        validateUserExists(userId);
        address.setUserId(userId);
        
        // Si es la primera dirección, marcarla como predeterminada
        if (addressPort.findByUserId(userId).isEmpty()) {
            address.setDefault(true);
        }
        
        return addressPort.save(address);
    }

    public Address updateAddress(Long addressId, Address updatedAddress, Long userId) {
        Address existing = getAddressById(addressId, userId);
        
        existing.setRecipientName(updatedAddress.getRecipientName());
        existing.setAddressLine(updatedAddress.getAddressLine());
        existing.setNeighborhood(updatedAddress.getNeighborhood());
        existing.setCity(updatedAddress.getCity());
        existing.setDepartment(updatedAddress.getDepartment());
        existing.setCountry(updatedAddress.getCountry());
        existing.setPostalCode(updatedAddress.getPostalCode());
        existing.setTelephone(updatedAddress.getTelephone());
        existing.setAddressType(updatedAddress.getAddressType());
        
        return addressPort.save(existing);
    }

    public void deleteAddress(Long addressId, Long userId) {
        Address address = getAddressById(addressId, userId);
        addressPort.deleteById(addressId);
    }

    public Address setDefaultAddress(Long addressId, Long userId) {
        validateUserExists(userId);
        return addressPort.setDefault(addressId, userId);
    }

    public Address getDefaultAddress(Long userId) {
        validateUserExists(userId);
        return addressPort.findDefaultByUserId(userId)
                .orElseGet(() -> addressPort.findByUserId(userId).stream()
                        .findFirst()
                        .orElse(null));
    }

    private void validateUserExists(Long userId) {
        userPort.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }
}
