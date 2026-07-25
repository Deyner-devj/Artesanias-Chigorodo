package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.models.financial.Withdrawal;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.out.UserPort;
import com.artesaniaschigorodo.domain.ports.out.WithdrawalPort;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/artisans")
@RequiredArgsConstructor
public class ArtisanEarningsController {

    private final WithdrawalPort withdrawalPort;
    private final UserPort userPort;

    /**
     * Obtiene las ganancias y estado financiero de un artesano.
     * GET /api/artisans/{id}/earnings
     * 
     * @param artisanId ID del artesano
     * @return Datos de ganancias: totalSales, netEarnings, availableBalance, pendingWithdrawals, payoutsHistory
     */
    @GetMapping("/{id}/earnings")
    public ResponseEntity<Map<String, Object>> getArtisanEarnings(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        
        // Validar que el usuario es el artesano o admin
        if (!currentUser.getId().equals(id) && currentUser.getRole() != Role.ADMIN) {
            throw new ForbiddenOperationException("Solo puedes ver tus propias ganancias o ser administrador");
        }
        
        Map<String, Object> earningsData = withdrawalPort.getArtisanEarnings(id);
        return ResponseEntity.ok(earningsData);
    }

    /**
     * Obtiene el historial de retiradas de un artesano.
     * GET /api/artisans/{id}/withdrawals
     * 
     * @param artisanId ID del artesano
     * @return Lista de retiradas
     */
    @GetMapping("/{id}/withdrawals")
    public ResponseEntity<List<Withdrawal>> getWithdrawalHistory(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        
        // Validar que el usuario es el artesano o admin
        if (!currentUser.getId().equals(id) && currentUser.getRole() != Role.ADMIN) {
            throw new ForbiddenOperationException("Solo puedes ver tu historial de retiradas o ser administrador");
        }
        
        List<Withdrawal> withdrawals = withdrawalPort.getWithdrawalHistory(id);
        return ResponseEntity.ok(withdrawals);
    }

    /**
     * Crea una nueva solicitud de retiro.
     * POST /api/artisans/{id}/withdrawals
     * 
     * @param artisanId ID del artesano
     * @param request Datos de la solicitud de retiro
     * @return Retiro creado
     */
    @PostMapping("/{id}/withdrawals")
    public ResponseEntity<Withdrawal> createWithdrawal(
            @PathVariable Long id, 
            @RequestBody CreateWithdrawalRequest request) {
        
        User currentUser = getCurrentUser();
        
        // Validar que el usuario es el artesano
        if (!currentUser.getId().equals(id)) {
            throw new ForbiddenOperationException("Solo puedes solicitar retiro para tu propia cuenta");
        }
        
        // Validar que el usuario es VENDOR
        if (currentUser.getRole() != Role.VENDOR) {
            throw new ForbiddenOperationException("Solo artesanos pueden solicitar retiradas");
        }
        
        // Validar monto
        if (request.getAmount() <= 0) {
            throw new ForbiddenOperationException("El monto debe ser mayor a cero");
        }
        
        // Calcular comisión y neto
        Double commission = withdrawalPort.calculatePlatformCommission(request.getAmount());
        Double netAmount = request.getAmount() - commission;
        
        // Validar que el monto no supere el saldo disponible
        Double availableBalance = withdrawalPort.calculateAvailableBalance(id);
        if (request.getAmount() > availableBalance) {
            throw new ForbiddenOperationException(
                "El monto solicitado supera tu saldo disponible. Saldo: " + availableBalance);
        }
        
        // Crear solicitud de retiro
        Withdrawal withdrawal = Withdrawal.builder()
                .artisanId(id)
                .artisanName(currentUser.getFullName())
                .bankName(request.getBankName())
                .accountNumber(request.getAccountNumber())
                .accountType(request.getAccountType())
                .amount(request.getAmount())
                .platformCommission(commission)
                .netAmount(netAmount)
                .status(Withdrawal.WithdrawalStatus.PENDING)
                .notes(request.getNotes())
                .build();
        
        Withdrawal createdWithdrawal = withdrawalPort.createWithdrawal(withdrawal);
        
        return ResponseEntity.ok(createdWithdrawal);
    }

    /**
     * Obtiene el saldo disponible para retiro.
     * GET /api/artisans/{id}/earnings/balance
     * 
     * @param artisanId ID del artesano
     * @return Saldo disponible
     */
    @GetMapping("/{id}/earnings/balance")
    public ResponseEntity<Map<String, Object>> getAvailableBalance(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        
        // Validar que el usuario es el artesano o admin
        if (!currentUser.getId().equals(id) && currentUser.getRole() != Role.ADMIN) {
            throw new ForbiddenOperationException("Solo puedes ver tu saldo disponible o ser administrador");
        }
        
        Map<String, Object> balanceData = Map.of(
            "availableBalance", withdrawalPort.calculateAvailableBalance(id),
            "platformCommissionRate", withdrawalPort.getPlatformCommissionRate() * 100
        );
        
        return ResponseEntity.ok(balanceData);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ForbiddenOperationException("Debe iniciar sesión para acceder a esta información");
        }
        String email = authentication.getName();
        return userPort.findByEmail(email)
                .orElseThrow(() -> new ForbiddenOperationException("Usuario actual no encontrado"));
    }

    /**
     * DTO para solicitud de retiro.
     */
    public static class CreateWithdrawalRequest {
        private String bankName;
        private String accountNumber;
        private String accountType;
        private Double amount;
        private String notes;

        public String getBankName() {
            return bankName;
        }

        public void setBankName(String bankName) {
            this.bankName = bankName;
        }

        public String getAccountNumber() {
            return accountNumber;
        }

        public void setAccountNumber(String accountNumber) {
            this.accountNumber = accountNumber;
        }

        public String getAccountType() {
            return accountType;
        }

        public void setAccountType(String accountType) {
            this.accountType = accountType;
        }

        public Double getAmount() {
            return amount;
        }

        public void setAmount(Double amount) {
            this.amount = amount;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }
}
