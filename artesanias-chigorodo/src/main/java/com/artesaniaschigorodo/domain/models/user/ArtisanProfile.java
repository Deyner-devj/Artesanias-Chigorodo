package com.artesaniaschigorodo.domain.models.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtisanProfile {

	private Long userId;
	private String businessName;
	private String displayName;
	private String bio;
	private String city;
	private String specialty;
	private String instagram;
	private String whatsapp;
	
	// Campos de configuración extendida
	private String phone;
	private String email;
	private String documentNumber;
	private String bank;
	private String accountNumber;
	private String accountType;
	private Integer averageShippingTime;
	private String shippingCity;
	private String notificationPreferences;
}
