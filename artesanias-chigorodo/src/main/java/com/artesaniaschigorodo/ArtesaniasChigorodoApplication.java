package com.artesaniaschigorodo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(excludeName = {
		"org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration",
		"org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration"
})
public class ArtesaniasChigorodoApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArtesaniasChigorodoApplication.class, args);
	}

}
