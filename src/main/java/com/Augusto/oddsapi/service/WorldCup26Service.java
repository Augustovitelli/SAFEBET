package com.Augusto.oddsapi.service;

import com.Augusto.oddsapi.dto.WorldCup26GameDTO;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class WorldCup26Service {

    private final WebClient webClient;

    public WorldCup26Service(WebClient.Builder builder) {
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 30000)
                .responseTimeout(Duration.ofSeconds(30))
                .doOnConnected(conn ->
                        conn.addHandlerLast(new ReadTimeoutHandler(30, TimeUnit.SECONDS)));

        this.webClient = builder
                .baseUrl("https://worldcup26.ir")
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }

    public List<WorldCup26GameDTO> getAllGames() {
        WorldCup26GameDTO.Response response = webClient.get()
                .uri("/get/games")
                .retrieve()
                .bodyToMono(WorldCup26GameDTO.Response.class)
                .block(Duration.ofSeconds(35));

        if (response == null || response.getGames() == null) {
            throw new RuntimeException("Nenhuma resposta da API worldcup26.ir");
        }

        return response.getGames();
    }

    public WorldCup26GameDTO getGame(String gameId) {
        return getAllGames().stream()
                .filter(g -> gameId.equals(g.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Jogo não encontrado na worldcup26.ir: " + gameId));
    }
}
