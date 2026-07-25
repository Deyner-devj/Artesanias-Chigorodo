package com.artesaniaschigorodo.application.adapters.persistence.sql.adapters;

import com.artesaniaschigorodo.application.adapters.persistence.sql.entities.WithdrawalEntity;
import com.artesaniaschigorodo.application.adapters.persistence.sql.mappers.WithdrawalMapper;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.OrderRepository;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.WithdrawalRepository;
import com.artesaniaschigorodo.domain.models.financial.Withdrawal;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.out.UserPort;
import com.artesaniaschigorodo.domain.ports.out.WithdrawalPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Adaptador para gestión de retiradas de ganancias.
 * Implementa la regla de negocio: comisión de plataforma = 0.000001% (0.00000001)
 */
@Component
@RequiredArgsConstructor
public class WithdrawalPersistenceAdapter implements WithdrawalPort {

    private final WithdrawalRepository withdrawalRepository;
    private final OrderRepository orderRepository;
    private final UserPort userPort;

    // Tasa de comisión: 0.000001% = 0.00000001
    private static final double PLATFORM_COMMISSION_RATE = 0.00000001;

    @Override
    public Withdrawal createWithdrawal(Withdrawal withdrawal) {
        WithdrawalEntity entity = WithdrawalMapper.toEntity(withdrawal);
        if (entity == null) {
            entity = WithdrawalEntity.builder()
                    .artisanId(withdrawal.getArtisanId())
                    .artisanName(withdrawal.getArtisanName())
                    .bankName(withdrawal.getBankName())
                    .accountNumber(withdrawal.getAccountNumber())
                    .accountType(withdrawal.getAccountType())
                    .amount(withdrawal.getAmount())
                    .platformCommission(withdrawal.getPlatformCommission())
                    .netAmount(withdrawal.getNetAmount())
                    .status(WithdrawalEntity.WithdrawalStatus.PENDING)
                    .requestedAt(LocalDateTime.now())
                    .build();
        }
        
        WithdrawalEntity savedEntity = withdrawalRepository.save(entity);
        return WithdrawalMapper.toDomain(savedEntity);
    }

    @Override
    public List<Withdrawal> getWithdrawalHistory(Long artisanId) {
        List<WithdrawalEntity> entities = withdrawalRepository.findByArtisanIdOrderByRequestedAtDesc(artisanId);
        return WithdrawalMapper.toDomainList(entities);
    }

    @Override
    public Map<String, Object> getArtisanEarnings(Long artisanId) {
        Map<String, Object> earningsData = new HashMap<>();

        // Obtener usuario artesano
        User artisan = userPort.findById(artisanId)
                .orElseThrow(() -> new RuntimeException("Artesano no encontrado"));

        // 1. Calcular ventas totales brutas
        java.time.LocalDate startDate = java.time.LocalDate.now().minusYears(1);
        Date start = Date.from(startDate.atStartOfDay(java.time.ZoneId.systemDefault()).toInstant());
        Date end = Date.from(java.time.LocalDate.now().atTime(23, 59, 59).atZone(java.time.ZoneId.systemDefault()).toInstant());
        
        List<Object[]> orderResults = orderRepository.findOrdersBySellerIdAndDateRange(artisanId, start, end);
        double totalSales = orderResults.stream()
                .mapToDouble(order -> (Double) order[0])
                .sum();

        // 2. Calcular comisión total de plataforma
        double totalCommission = calculatePlatformCommission(totalSales);
        
        // 3. Calcular ganancias netas
        double netEarnings = totalSales - totalCommission;

        // 4. Obtener historial de retiradas
        List<Withdrawal> withdrawals = getWithdrawalHistory(artisanId);
        
        // 5. Calcular total retirado
        double totalWithdrawn = withdrawals.stream()
                .filter(w -> w.getStatus() == Withdrawal.WithdrawalStatus.COMPLETED)
                .mapToDouble(Withdrawal::getNetAmount)
                .sum();

        // 6. Calcular saldo disponible
        double availableBalance = netEarnings - totalWithdrawn;

        // 7. Obtener retiradas pendientes
        List<Withdrawal> pendingWithdrawals = withdrawals.stream()
                .filter(w -> w.getStatus() == Withdrawal.WithdrawalStatus.PENDING || 
                           w.getStatus() == Withdrawal.WithdrawalStatus.PROCESSING)
                .collect(Collectors.toList());

        // Construir respuesta
        earningsData.put("artisanId", artisanId);
        earningsData.put("artisanName", artisan.getFullName());
        earningsData.put("totalSales", totalSales);
        earningsData.put("totalCommission", totalCommission);
        earningsData.put("netEarnings", netEarnings);
        earningsData.put("totalWithdrawn", totalWithdrawn);
        earningsData.put("availableBalance", Math.max(0, availableBalance));
        earningsData.put("platformCommissionRate", PLATFORM_COMMISSION_RATE * 100); // Como porcentaje
        earningsData.put("commissionRate", PLATFORM_COMMISSION_RATE); // Como decimal para cálculos
        earningsData.put("pendingWithdrawals", pendingWithdrawals);
        earningsData.put("payoutsHistory", withdrawals);

        return earningsData;
    }

    @Override
    public Double calculateAvailableBalance(Long artisanId) {
        Map<String, Object> earnings = getArtisanEarnings(artisanId);
        return (Double) earnings.get("availableBalance");
    }

    @Override
    public Double calculatePlatformCommission(Double amount) {
        return amount * PLATFORM_COMMISSION_RATE;
    }

    @Override
    public Double getPlatformCommissionRate() {
        return PLATFORM_COMMISSION_RATE;
    }
}
