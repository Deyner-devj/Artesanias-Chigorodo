package com.artesaniaschigorodo.application.adapters.persistence.sql.mappers;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.AddressEntity;
import com.artesaniaschigorodo.domain.models.user.Address;

public class AddressMapper {

    public static AddressEntity toEntity(Address domain) {
        if (domain == null) return null;
        return AddressEntity.builder()
                .id(domain.getId())
                .userId(domain.getUserId())
                .recipientName(domain.getRecipientName())
                .addressLine(domain.getAddressLine())
                .neighborhood(domain.getNeighborhood())
                .city(domain.getCity())
                .department(domain.getDepartment())
                .country(domain.getCountry())
                .postalCode(domain.getPostalCode())
                .telephone(domain.getTelephone())
                .isDefault(domain.isDefault())
                .addressType(domain.getAddressType())
                .build();
    }

    public static Address toDomain(AddressEntity entity) {
        if (entity == null) return null;
        return Address.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .recipientName(entity.getRecipientName())
                .addressLine(entity.getAddressLine())
                .neighborhood(entity.getNeighborhood())
                .city(entity.getCity())
                .department(entity.getDepartment())
                .country(entity.getCountry())
                .postalCode(entity.getPostalCode())
                .telephone(entity.getTelephone())
                .isDefault(entity.isDefault())
                .addressType(entity.getAddressType())
                .build();
    }
}
