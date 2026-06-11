package com.Augusto.oddsapi.service;

import com.Augusto.oddsapi.dto.FootballDataMatchDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class FootballDataService {

    @Value("${football-data.api.key}")
    private String apiKey;

    private final WebClient webClient;

    public FootballDataService(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("https://api.football-data.org")
                .build();
    }

    public FootballDataMatchDTO getMatch(String matchId) {
        return webClient.get()
                .uri("/v4/matches/" + matchId)
                .header("X-Auth-Token", apiKey)
                .retrieve()
                .bodyToMono(FootballDataMatchDTO.class)
                .block();
    }
}
