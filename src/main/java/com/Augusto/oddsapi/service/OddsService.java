package com.Augusto.oddsapi.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.Augusto.oddsapi.entity.BookmakerEntity;
import com.Augusto.oddsapi.entity.GameEntity;
import com.Augusto.oddsapi.entity.MarketEntity;
import com.Augusto.oddsapi.entity.OutcomeEntity;
import com.Augusto.oddsapi.model.Bookmaker;
import com.Augusto.oddsapi.model.Game;
import com.Augusto.oddsapi.model.Market;
import com.Augusto.oddsapi.model.Outcome;
import com.Augusto.oddsapi.repository.GameRepository;

import jakarta.transaction.Transactional;

@Service
public class OddsService {

    @Value("${api.key}")
    private String apiKey;

    private final WebClient webClient;
    private final GameRepository gameRepository;

    public OddsService(WebClient.Builder builder, GameRepository gameRepository) {

        this.webClient = builder
                .baseUrl("https://api.the-odds-api.com")
                .build();

        this.gameRepository = gameRepository;
    }
    //tem que ver se o bd ta duplicando os jogos 
    @Transactional
    public List<Game> getOdds() {

        List<Game> games = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v4/sports/soccer_brazil_campeonato/odds")
                        .queryParam("apiKey", apiKey)
                        .queryParam("regions", "us")
                        .queryParam("markets", "h2h")
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Game>>() {})
                .block();

        salvarGamesNoBanco(games);

        return games;
    }

    public void salvarGamesNoBanco(List<Game> games) {

        List<GameEntity> entidades = new ArrayList<>();

        for (Game game : games) {

            GameEntity gameEntity = new GameEntity();

            gameEntity.setHomeTeam(game.getHome_team());
            gameEntity.setAwayTeam(game.getAway_team());
            gameEntity.setSportKey(game.getSport_key());

            

            List<BookmakerEntity> bookmakerEntities = new ArrayList<>();

            for (Bookmaker bookmaker : game.getBookmakers()) {

                BookmakerEntity bookmakerEntity = new BookmakerEntity();

                
                bookmakerEntity.setTitle(bookmaker.getTitle());
                bookmakerEntity.setLastUpdate(LocalDateTime.now());
                bookmakerEntity.setGame(gameEntity);

                List<MarketEntity> marketEntities = new ArrayList<>();

                for (Market market : bookmaker.getMarkets()) {

                    MarketEntity marketEntity = new MarketEntity();

                    marketEntity.setBookmaker(bookmakerEntity);

                    List<OutcomeEntity> outcomeEntities = new ArrayList<>();

                    for (Outcome outcome : market.getOutcomes()) {

                        OutcomeEntity outcomeEntity = new OutcomeEntity();

                        outcomeEntity.setName(outcome.getName());
                        outcomeEntity.setPrice(outcome.getPrice());

                        outcomeEntities.add(outcomeEntity);
                        outcomeEntity.setMarket(marketEntity);
                    }

                    marketEntity.setOutcomes(outcomeEntities);

                    marketEntities.add(marketEntity);
                }

                bookmakerEntity.setMarkets(marketEntities);

                bookmakerEntities.add(bookmakerEntity);
            }

            gameEntity.setBookmakers(bookmakerEntities);

            entidades.add(gameEntity);
        }

        gameRepository.saveAll(entidades);
    }
}