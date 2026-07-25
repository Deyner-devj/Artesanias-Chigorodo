package com.artesaniaschigorodo.application.adapters.persistence.sql.adapters;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.AddressEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.mappers.AddressMapper;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.AddressRepository;
import com.artesaniaschigorodo.domain.models.user.Address;
import com.artesaniaschigorodo.domain.ports.out.AddressPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AddressPersistenceAdapter implements AddressPort {

    private final AddressRepository addressRepository;

    @Override
    public Optional<Address> findById(Long id) {
        return addressRepository.findById(id).map(AddressMapper::toDomain);
    }

    @Override
    public List<Address> findByUserId(Long userId) {
        return addressRepository.findByUserId(userId).stream()
                .map(AddressMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Address> findDefaultByUserId(Long userId) {
        return addressRepository.findByUserIdAndIsDefaultTrue(userId).map(AddressMapper::toDomain);
    }

    @Override
    public Address save(Address address) {
        AddressEntity entity = AddressMapper.toEntity(address);
        AddressEntity savedEntity = addressRepository.save(entity);
        return AddressMapper.toDomain(savedEntity);
    }

    @Override
    public void deleteById(Long id) {
        addressRepository.deleteById(id);
    }

    @Override
    public Address setDefault(Long id, Long userId) {
        // Desmarcar la actual predeterminada
        addressRepository.findByUserIdAndIsDefaultTrue(userId).ifPresent(existing -> {
            existing.setDefault(false);
            addressRepository.save(existing);
        });
        
        // Marcar la nueva como predeterminada
        AddressEntity entity = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        entity.setDefault(true);
        AddressEntity savedEntity = addressRepository.save(entity);
        return AddressMapper.toDomain(savedEntity);
    }
}
