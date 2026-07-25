package com.artesaniaschigorodo.domain.ports.out;

import com.artesaniaschigorodo.domain.models.user.SavedPaymentMethod;

import java.util.List;
import java.util.Optional;

public interface SavedPaymentMethodPort {
    Optional<SavedPaymentMethod> findById(Long id);
    List<SavedPaymentMethod> findByUserId(Long userId);
    Optional<SavedPaymentMethod> findDefaultByUserId(Long userId);
    SavedPaymentMethod save(SavedPaymentMethod paymentMethod);
    void deleteById(Long id);
    SavedPaymentMethod setDefault(Long id, Long userId);
}
