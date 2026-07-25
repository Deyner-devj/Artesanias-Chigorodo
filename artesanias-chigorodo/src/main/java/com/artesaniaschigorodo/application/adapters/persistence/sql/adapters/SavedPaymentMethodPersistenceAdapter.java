package com.artesaniaschigorodo.application.adapters.persistence.sql.adapters;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.SavedPaymentMethodEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.mappers.SavedPaymentMethodMapper;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.SavedPaymentMethodRepository;
import com.artesaniaschigorodo.domain.models.user.SavedPaymentMethod;
import com.artesaniaschigorodo.domain.ports.out.SavedPaymentMethodPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class SavedPaymentMethodPersistenceAdapter implements SavedPaymentMethodPort {

    private final SavedPaymentMethodRepository paymentMethodRepository;

    @Override
    public Optional<SavedPaymentMethod> findById(Long id) {
        return paymentMethodRepository.findById(id).map(SavedPaymentMethodMapper::toDomain);
    }

    @Override
    public List<SavedPaymentMethod> findByUserId(Long userId) {
        return paymentMethodRepository.findByUserId(userId).stream()
                .map(SavedPaymentMethodMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<SavedPaymentMethod> findDefaultByUserId(Long userId) {
        return paymentMethodRepository.findByUserIdAndIsDefaultTrue(userId)
                .map(SavedPaymentMethodMapper::toDomain);
    }

    @Override
    public SavedPaymentMethod save(SavedPaymentMethod paymentMethod) {
        SavedPaymentMethodEntity entity = SavedPaymentMethodMapper.toEntity(paymentMethod);
        SavedPaymentMethodEntity savedEntity = paymentMethodRepository.save(entity);
        return SavedPaymentMethodMapper.toDomain(savedEntity);
    }

    @Override
    public void deleteById(Long id) {
        paymentMethodRepository.deleteById(id);
    }

    @Override
    public SavedPaymentMethod setDefault(Long id, Long userId) {
        // Desmarcar la actual predeterminada
        paymentMethodRepository.findByUserIdAndIsDefaultTrue(userId).ifPresent(existing -> {
            existing.setDefault(false);
            paymentMethodRepository.save(existing);
        });
        
        // Marcar la nueva como predeterminada
        SavedPaymentMethodEntity entity = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment method not found"));
        entity.setDefault(true);
        SavedPaymentMethodEntity savedEntity = paymentMethodRepository.save(entity);
        return SavedPaymentMethodMapper.toDomain(savedEntity);
    }
}
