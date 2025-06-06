package com.kbo.baseball;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BaseballApplication {

    public static void main(String[] args) {
        SpringApplication.run(BaseballApplication.class, args);
    }
} 