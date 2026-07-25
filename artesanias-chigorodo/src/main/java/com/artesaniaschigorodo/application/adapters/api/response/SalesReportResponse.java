package com.artesaniaschigorodo.application.adapters.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesReportResponse {
    private Long artisanId;
    private String artisanName;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalRevenue;
    private Integer totalUnitsSold;
    private Integer totalOrders;
    private List<Map<String, Object>> topProducts;
}
