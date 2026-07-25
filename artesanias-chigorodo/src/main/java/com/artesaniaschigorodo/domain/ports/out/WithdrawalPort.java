package com.artesaniaschigorodo.domain.ports.out;

import com.artesaniaschigorodo.domain.models.financial.Withdrawal;

import java.util.List;
import java.util.Map;

/**
 * Puerto para gestión de retiradas de ganancias.
 */
public interface WithdrawalPort {

    /**
     * Crea una nueva solicitud de retiro.
     * @param withdrawal Solicitud de retiro
     * @return Retiro creado
     */
    Withdrawal createWithdrawal(Withdrawal withdrawal);

    /**
     * Obtiene el historial de retiradas de un artesano.
     * @param artisanId ID del artesano
     * @return Lista de retiradas
     */
    List<Withdrawal> getWithdrawalHistory(Long artisanId);

    /**
     * Obtiene los datos de ganancias de un artesano.
     * @param artisanId ID del artesano
     * @return Mapa con: totalEarnings, pendingWithdrawals, payoutsHistory, commissionRate
     */
    Map<String, Object> getArtisanEarnings(Long artisanId);

    /**
     * Calcula el saldo disponible para retiro.
     * @param artisanId ID del artesano
     * @return Saldo disponible (ventas totales - comisión - ya retirado)
     */
    Double calculateAvailableBalance(Long artisanId);

    /**
     * Calcula la comisión de la plataforma para un monto.
     * @param amount Monto bruto
     * @return Comisión (0.000001% del monto)
     */
    Double calculatePlatformCommission(Double amount);

    /**
     * Obtiene la tasa de comisión de la plataforma.
     * @return Tasa de comisión (0.000001% = 0.00000001)
     */
    Double getPlatformCommissionRate();
}
