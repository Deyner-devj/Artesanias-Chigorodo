package com.artesaniaschigorodo.application.adapters.api.controllers;

import com.artesaniaschigorodo.application.adapters.api.response.SiteStatsResponse;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.models.enums.UserStatus;
import com.artesaniaschigorodo.domain.ports.out.ProductPort;
import com.artesaniaschigorodo.domain.ports.out.UserPort;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class SiteStatsController {

    private final UserPort userPort;
    private final ProductPort productPort;

    @GetMapping("/public")
    public ResponseEntity<SiteStatsResponse> getPublicStats() {
        long totalArtisans = userPort.findAllByRole(Role.VENDOR).stream()
                .filter(user -> user.getStatus() == UserStatus.ACTIVE)
                .count();

        long totalProducts = productPort.findAll().size();

        double averageRating = productPort.findAll().stream()
                .mapToDouble(product -> product.getRating() != null ? product.getRating() : 0.0)
                .average()
                .orElse(0.0);

        SiteStatsResponse response = SiteStatsResponse.builder()
                .totalArtisans(totalArtisans)
                .totalProducts(totalProducts)
                .averageRating(Math.round(averageRating * 10) / 10.0)
                .build();

        return ResponseEntity.ok(response);
    }
}
