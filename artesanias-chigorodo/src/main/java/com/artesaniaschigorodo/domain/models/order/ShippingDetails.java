package com.artesaniaschigorodo.domain.models.order;

import com.artesaniaschigorodo.domain.models.enums.ShippingMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShippingDetails {
    private String country;
    private String department;
    private String city;
    private String address;
    private String postalCode;
    private ShippingMethod shippingMethod;
}

