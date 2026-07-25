package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.response.SalesReportResponse;
import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.out.SalesReportPort;
import com.artesaniaschigorodo.domain.ports.out.UserPort;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales-reports")
@RequiredArgsConstructor
public class SalesReportController {

    private final SalesReportPort salesReportPort;
    private final UserPort userPersistencePort;

    @GetMapping("/artisan")
    public ResponseEntity<SalesReportResponse> getArtisanSalesReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        User currentUser = getCurrentUser();
        
        // Validar que el usuario sea VENDOR o ADMIN
        if (currentUser.getRole() != Role.VENDOR && currentUser.getRole() != Role.ADMIN) {
            throw new ForbiddenOperationException("Solo artesanos y administradores pueden acceder a los reportes de ventas");
        }
        
        // Fechas por defecto: último mes
        if (startDate == null) {
            startDate = LocalDate.now().minusMonths(1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        
        Map<String, Object> reportData = salesReportPort.generateArtisanSalesReport(currentUser, startDate, endDate);
        
        SalesReportResponse response = SalesReportResponse.builder()
                .artisanId((Long) reportData.get("artisanId"))
                .artisanName((String) reportData.get("artisanName"))
                .startDate(startDate)
                .endDate(endDate)
                .totalRevenue((Double) reportData.get("totalRevenue"))
                .totalUnitsSold((Integer) reportData.get("totalUnitsSold"))
                .totalOrders((Integer) reportData.get("totalOrders"))
                .topProducts((List<Map<String, Object>>) reportData.get("topProducts"))
                .build();
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/artisan/customers")
    public ResponseEntity<List<Map<String, Object>>> getArtisanCustomers() {
        User currentUser = getCurrentUser();
        
        // Validar que el usuario sea VENDOR
        if (currentUser.getRole() != Role.VENDOR && currentUser.getRole() != Role.ADMIN) {
            throw new ForbiddenOperationException("Solo artesanos pueden acceder a sus clientes");
        }
        
        List<Map<String, Object>> customers = salesReportPort.getArtisanCustomers(currentUser.getId());
        
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/global")
    public ResponseEntity<Map<String, Object>> getGlobalSalesReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        User currentUser = getCurrentUser();
        
        // Validar que el usuario sea ADMIN
        if (currentUser.getRole() != Role.ADMIN) {
            throw new ForbiddenOperationException("Solo administradores pueden acceder a los reportes globales");
        }
        
        // Fechas por defecto: último mes
        if (startDate == null) {
            startDate = LocalDate.now().minusMonths(1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        
        Map<String, Object> reportData = salesReportPort.generateGlobalSalesReport(startDate, endDate);
        
        return ResponseEntity.ok(reportData);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ForbiddenOperationException("Debe iniciar sesión para acceder a los reportes");
        }
        String email = authentication.getName();
        return userPersistencePort.findByEmail(email)
                .orElseThrow(() -> new ForbiddenOperationException("Usuario actual no encontrado"));
    }
}
