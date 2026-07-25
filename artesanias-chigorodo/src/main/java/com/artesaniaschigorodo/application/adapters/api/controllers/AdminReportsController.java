package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.out.SalesReportPort;
import com.artesaniaschigorodo.domain.ports.out.UserPort;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Controlador para reportes administrativos y exportación a Excel.
 */
@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
public class AdminReportsController {

    private final SalesReportPort salesReportPort;
    private final UserPort userPort;

    /**
     * Exporta reporte de ventas global a Excel.
     * GET /api/admin/reports/export
     * Solo accesible por administradores.
     */
    @GetMapping("/export")
    public void exportSalesReportToExcel(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            HttpServletResponse response) throws IOException {
        
        User currentUser = getCurrentUser();
        
        // Validar que el usuario sea ADMIN
        if (currentUser.getRole() != Role.ADMIN) {
            throw new ForbiddenOperationException("Solo administradores pueden exportar reportes");
        }
        
        // Fechas por defecto: último mes
        if (startDate == null) {
            startDate = LocalDate.now().minusMonths(1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        
        // Obtener datos del reporte global
        Map<String, Object> reportData = salesReportPort.generateGlobalSalesReport(startDate, endDate);
        
        // Crear archivo Excel
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Reporte de Ventas");
        
        // Crear estilo para encabezados
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setFontHeightInPoints((short) 12);
        headerStyle.setFont(headerFont);
        headerStyle.setBorderBottom(BorderStyle.THIN);
        headerStyle.setBorderTop(BorderStyle.THIN);
        headerStyle.setBorderLeft(BorderStyle.THIN);
        headerStyle.setBorderRight(BorderStyle.THIN);
        
        // Crear fila de encabezados
        Row headerRow = sheet.createRow(0);
        String[] headers = {
            "Fecha Inicio", "Fecha Fin", "Ingresos Totales", "Pedidos Totales", 
            "Unidades Vendidas", "Producto", "Categoría", "Unidades", "Precio"
        };
        
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        
        // Agregar datos del reporte
        int rowNum = 1;
        
        // Datos agregados
        Row summaryRow = sheet.createRow(rowNum++);
        summaryRow.createCell(0).setCellValue(startDate.toString());
        summaryRow.createCell(1).setCellValue(endDate.toString());
        summaryRow.createCell(2).setCellValue((Double) reportData.get("totalRevenue"));
        summaryRow.createCell(3).setCellValue((Integer) reportData.get("totalOrders"));
        summaryRow.createCell(4).setCellValue((Integer) reportData.get("totalUnitsSold"));
        summaryRow.createCell(5).setCellValue("");
        summaryRow.createCell(6).setCellValue("");
        summaryRow.createCell(7).setCellValue("");
        summaryRow.createCell(8).setCellValue("");
        
        // Productos más vendidos
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> topProducts = (List<Map<String, Object>>) reportData.get("topProducts");
        if (topProducts != null) {
            for (Map<String, Object> product : topProducts) {
                Row productRow = sheet.createRow(rowNum++);
                productRow.createCell(0).setCellValue("");
                productRow.createCell(1).setCellValue("");
                productRow.createCell(2).setCellValue("");
                productRow.createCell(3).setCellValue("");
                productRow.createCell(4).setCellValue("");
                productRow.createCell(5).setCellValue((String) product.get("productName"));
                productRow.createCell(6).setCellValue((String) product.get("category"));
                productRow.createCell(7).setCellValue((Integer) product.get("unitsSold"));
                productRow.createCell(8).setCellValue((Double) product.get("price"));
            }
        }
        
        // Ajustar ancho de columnas
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
        
        // Configurar respuesta HTTP
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", 
            "attachment; filename=reporte_ventas_" + startDate + "_a_" + endDate + ".xlsx");
        
        // Escribir el archivo
        workbook.write(response.getOutputStream());
        workbook.close();
    }

    /**
     * Obtiene reporte global de ventas (para admin).
     * GET /api/admin/reports
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAdminReports(
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
        return userPort.findByEmail(email)
                .orElseThrow(() -> new ForbiddenOperationException("Usuario actual no encontrado"));
    }
}
