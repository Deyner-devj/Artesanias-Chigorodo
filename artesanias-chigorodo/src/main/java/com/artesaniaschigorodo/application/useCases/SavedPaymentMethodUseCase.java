package com.artesaniaschigorodo.application.useCases;

import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.user.SavedPaymentMethod;
import com.artesaniaschigorodo.domain.ports.out.SavedPaymentMethodPort;
import com.artesaniaschigorodo.domain.ports.out.UserPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedPaymentMethodUseCase {

    private final SavedPaymentMethodPort paymentMethodPort;
    private final UserPort userPort;

    public List<SavedPaymentMethod> getPaymentMethodsByUserId(Long userId) {
        validateUserExists(userId);
        return paymentMethodPort.findByUserId(userId);
    }

    public SavedPaymentMethod getPaymentMethodById(Long paymentMethodId, Long userId) {
        SavedPaymentMethod paymentMethod = paymentMethodPort.findById(paymentMethodId)
                .orElseThrow(() -> new ResourceNotFoundException("Método de pago no encontrado"));
        
        if (!paymentMethod.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Método de pago no encontrado para este usuario");
        }
        
        return paymentMethod;
    }

    public SavedPaymentMethod createPaymentMethod(SavedPaymentMethod paymentMethod, Long userId) {
        validateUserExists(userId);
        paymentMethod.setUserId(userId);
        
        // Extraer los últimos 4 dígitos
        if (paymentMethod.getCardNumber() != null && paymentMethod.getCardNumber().length() >= 4) {
            paymentMethod.setLastFourDigits(paymentMethod.getCardNumber().substring(
                    paymentMethod.getCardNumber().length() - 4));
        }
        
        // Si es el primer método de pago, marcarlo como predeterminado
        if (paymentMethodPort.findByUserId(userId).isEmpty()) {
            paymentMethod.setDefault(true);
        }
        
        // No guardar CVV en la base de datos por seguridad
        paymentMethod.setCvv(null);
        
        return paymentMethodPort.save(paymentMethod);
    }

    public SavedPaymentMethod updatePaymentMethod(Long paymentMethodId, SavedPaymentMethod updatedPaymentMethod, Long userId) {
        SavedPaymentMethod existing = getPaymentMethodById(paymentMethodId, userId);
        
        existing.setCardType(updatedPaymentMethod.getCardType());
        existing.setCardNumber(updatedPaymentMethod.getCardNumber());
        existing.setCardHolderName(updatedPaymentMethod.getCardHolderName());
        existing.setExpiryDate(updatedPaymentMethod.getExpiryDate());
        
        // Actualizar últimos 4 dígitos
        if (updatedPaymentMethod.getCardNumber() != null && updatedPaymentMethod.getCardNumber().length() >= 4) {
            existing.setLastFourDigits(updatedPaymentMethod.getCardNumber().substring(
                    updatedPaymentMethod.getCardNumber().length() - 4));
        }
        
        // No guardar CVV
        existing.setCvv(null);
        
        return paymentMethodPort.save(existing);
    }

    public void deletePaymentMethod(Long paymentMethodId, Long userId) {
        SavedPaymentMethod paymentMethod = getPaymentMethodById(paymentMethodId, userId);
        paymentMethodPort.deleteById(paymentMethodId);
    }

    public SavedPaymentMethod setDefaultPaymentMethod(Long paymentMethodId, Long userId) {
        validateUserExists(userId);
        return paymentMethodPort.setDefault(paymentMethodId, userId);
    }

    public SavedPaymentMethod getDefaultPaymentMethod(Long userId) {
        validateUserExists(userId);
        return paymentMethodPort.findDefaultByUserId(userId)
                .orElseGet(() -> paymentMethodPort.findByUserId(userId).stream()
                        .findFirst()
                        .orElse(null));
    }

    private void validateUserExists(Long userId) {
        userPort.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }
}
