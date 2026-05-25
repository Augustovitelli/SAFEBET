package com.Augusto.oddsapi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.Augusto.oddsapi.model.Game;

@Service
public class OddsService {

    @Value("${api.key}")
    private String apiKey;

    private final WebClient webClient;

    public OddsService(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("https://api.the-odds-api.com").build();
    }

    public List<Game> getOdds() {

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v4/sports/soccer_brazil_campeonato/odds")
                        .queryParam("apiKey", apiKey)
                        .queryParam("regions", "us")
                        .queryParam("markets", "h2h")
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Game>>() {})
                .block();
    }
}