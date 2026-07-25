package com.artesaniaschigorodo.domain.ports.out;

import com.artesaniaschigorodo.domain.models.user.Address;

import java.util.List;
import java.util.Optional;

public interface AddressPort {
    Optional<Address> findById(Long id);
    List<Address> findByUserId(Long userId);
    Optional<Address> findDefaultByUserId(Long userId);
    Address save(Address address);
    void deleteById(Long id);
    Address setDefault(Long id, Long userId);
}
