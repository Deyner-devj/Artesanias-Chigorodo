package com.artesaniaschigorodo.application.adapters.persistence.sql.adapters.reports;

import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.OrderRepository;
import com.artesaniaschigorodo.application.adapters.persistence.sql.repositories.ProductRepository;
import com.artesaniaschigorodo.domain.models.category.Category;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.ports.out.SalesReportPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Adaptador para generación de reportes de ventas.
 * Proporciona datos de ventas para artesanos y administradores.
 */
@Component
@RequiredArgsConstructor
public class SalesReportExcelAdapter implements SalesReportPort {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Override
    public Map<String, Object> generateArtisanSalesReport(User artisan, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> report = new HashMap<>();
        
        // Convertir LocalDate a Date para consulta JPA
        Date start = Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date end = Date.from(endDate.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant());
        
        // Obtener pedidos que contienen productos del artesano
        List<Object[]> orderResults = orderRepository.findOrdersBySellerIdAndDateRange(
                artisan.getId(), start, end);
        
        // Calcular métricas
        double totalRevenue = 0.0;
        int totalUnitsSold = 0;
        int totalOrders = orderResults.size();
        Map<Long, Integer> productSales = new HashMap<>();
        
        for (Object[] orderData : orderResults) {
            Double orderTotal = (Double) orderData[0];
            Long productId = (Long) orderData[1];
            Integer quantity = (Integer) orderData[2];
            
            totalRevenue += orderTotal;
            totalUnitsSold += quantity;
            productSales.merge(productId, quantity, Integer::sum);
        }
        
        // Obtener productos más vendidos
        List<Map<String, Object>> topProducts = productSales.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .limit(5)
                .map(entry -> {
                    Map<String, Object> productInfo = new HashMap<>();
                    productInfo.put("productId", entry.getKey());
                    productInfo.put("unitsSold", entry.getValue());
                    productRepository.findById(entry.getKey()).ifPresent(product -> {
                        productInfo.put("productName", product.getName());
                        productInfo.put("price", product.getPrice());
                    });
                    return productInfo;
                })
                .collect(Collectors.toList());
        
        // Construir reporte
        report.put("artisanId", artisan.getId());
        report.put("artisanName", artisan.getFullName());
        report.put("startDate", startDate);
        report.put("endDate", endDate);
        report.put("totalRevenue", totalRevenue);
        report.put("totalUnitsSold", totalUnitsSold);
        report.put("totalOrders", totalOrders);
        report.put("topProducts", topProducts);
        
        return report;
    }

    @Override
    public Map<String, Object> generateGlobalSalesReport(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> report = new HashMap<>();
        
        // Convertir LocalDate a Date para consulta JPA
        Date start = Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date end = Date.from(endDate.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant());
        
        // Obtener todos los pedidos en el rango de fechas
        List<Object[]> allOrders = orderRepository.findAllOrdersInDateRange(start, end);
        
        // Calcular métricas globales
        double totalRevenue = allOrders.stream()
                .mapToDouble(order -> (Double) order[0])
                .sum();
        
        int totalOrders = allOrders.size();
        int totalUnitsSold = allOrders.stream()
                .mapToInt(order -> (Integer) order[1])
                .sum();
        
        // Obtener productos más vendidos globalmente
        Map<Long, Integer> productSales = new HashMap<>();
        for (Object[] orderData : allOrders) {
            Long productId = (Long) orderData[2];
            Integer quantity = (Integer) orderData[1];
            productSales.merge(productId, quantity, Integer::sum);
        }
        
        List<Map<String, Object>> topProducts = productSales.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .limit(10)
                .map(entry -> {
                    Map<String, Object> productInfo = new HashMap<>();
                    productInfo.put("productId", entry.getKey());
                    productInfo.put("unitsSold", entry.getValue());
                    productRepository.findById(entry.getKey()).ifPresent(product -> {
                        productInfo.put("productName", product.getName());
                        productInfo.put("category", product.getCategory());
                        productInfo.put("price", product.getPrice());
                    });
                    return productInfo;
                })
                .collect(Collectors.toList());
        
        // Construir reporte
        report.put("startDate", startDate);
        report.put("endDate", endDate);
        report.put("totalRevenue", totalRevenue);
        report.put("totalOrders", totalOrders);
        report.put("totalUnitsSold", totalUnitsSold);
        report.put("topProducts", topProducts);
        
        return report;
    }

    @Override
    public List<Map<String, Object>> getArtisanCustomers(Long artisanId) {
        List<Map<String, Object>> customers = new ArrayList<>();
        
        // Obtener pedidos que contienen productos del artesano
        List<Object[]> orderResults = orderRepository.findOrdersWithCustomerInfoBySellerId(artisanId);
        
        // Agrupar por cliente
        Map<Long, Map<String, Object>> customerMap = new HashMap<>();
        
        for (Object[] orderData : orderResults) {
            Long customerId = (Long) orderData[0];
            String customerName = (String) orderData[1];
            String customerEmail = (String) orderData[2];
            Long orderId = (Long) orderData[3];
            String orderNumber = (String) orderData[4];
            Date orderDate = (Date) orderData[5];
            Double orderTotal = (Double) orderData[6];
            
            Map<String, Object> customerInfo = customerMap.computeIfAbsent(customerId, k -> {
                Map<String, Object> newCustomer = new HashMap<>();
                newCustomer.put("customerId", customerId);
                newCustomer.put("customerName", customerName);
                newCustomer.put("customerEmail", customerEmail);
                newCustomer.put("purchases", new ArrayList<Map<String, Object>>());
                newCustomer.put("totalSpent", 0.0);
                newCustomer.put("lastPurchaseDate", (Date) null);
                return newCustomer;
            });
            
            // Agregar información de la compra
            Map<String, Object> purchase = new HashMap<>();
            purchase.put("orderId", orderId);
            purchase.put("orderNumber", orderNumber);
            purchase.put("orderDate", orderDate);
            purchase.put("orderTotal", orderTotal);
            
            ((List<Map<String, Object>>) customerInfo.get("purchases")).add(purchase);
            customerInfo.put("totalSpent", (Double) customerInfo.get("totalSpent") + orderTotal);
            
            Date lastDate = (Date) customerInfo.get("lastPurchaseDate");
            if (lastDate == null || orderDate.after(lastDate)) {
                customerInfo.put("lastPurchaseDate", orderDate);
            }
        }
        
        // Convertir a lista y ordenar por total gastado
        customers = new ArrayList<>(customerMap.values());
        customers.sort((c1, c2) -> ((Double) c2.get("totalSpent")).compareTo((Double) c1.get("totalSpent")));
        
        return customers;
    }
}

