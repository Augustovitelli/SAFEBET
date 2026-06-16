package com.Augusto.oddsapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class OddsapiApplication {

	public static void main(String[] args) {
		SpringApplication.run(OddsapiApplication.class, args);
	}

}
