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
	private String bio;
	private String city;
	private String specialty;
	private String instagram;
	private String whatsapp;
}
