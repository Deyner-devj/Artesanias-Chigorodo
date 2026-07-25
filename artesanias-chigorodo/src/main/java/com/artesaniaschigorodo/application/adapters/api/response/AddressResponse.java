package com.artesaniaschigorodo.application.adapters.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponse {
    private Long id;
    private Long userId;
    private String recipientName;
    private String addressLine;
    private String neighborhood;
    private String city;
    private String department;
    private String country;
    private String postalCode;
    private String telephone;
    private boolean isDefault;
    private String addressType;
}
