package com.artesaniaschigorodo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.artesaniaschigorodo")
public class ArtesaniasChigorodoApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArtesaniasChigorodoApplication.class, args);
	}

}

