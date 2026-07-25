package com.artesaniaschigorodo.domain.ports.out;

import com.artesaniaschigorodo.domain.models.user.User;

import java.time.LocalDate;
import java.util.Map;

/**
 * Puerto para generación de reportes de ventas.
 * Proporciona datos de ventas para artesanos y administradores.
 */
public interface SalesReportPort {

    /**
     * Genera un reporte de ventas para un artesano específico.
     * @param artisan User del artesano
     * @param startDate Fecha de inicio del reporte
     * @param endDate Fecha de fin del reporte
     * @return Mapa con datos del reporte (totalVentas, totalIngresos, productosVendidos, etc.)
     */
    Map<String, Object> generateArtisanSalesReport(User artisan, LocalDate startDate, LocalDate endDate);

    /**
     * Genera un reporte de ventas global para administradores.
     * @param startDate Fecha de inicio del reporte
     * @param endDate Fecha de fin del reporte
     * @return Mapa con datos del reporte global
     */
    Map<String, Object> generateGlobalSalesReport(LocalDate startDate, LocalDate endDate);

    /**
     * Obtiene los clientes de un artesano (compradores de sus productos).
     * @param artisanId ID del artesano
     * @return Lista de clientes con su historial de compras
     */
    java.util.List<Map<String, Object>> getArtisanCustomers(Long artisanId);
}
