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

    // Busca do banco (endpoint /odds)
    @Transactional
    public List<Game> getOdds() {
        return buscarDoBanco();
    }

    // Chama API, apaga tudo e salva novos dados (endpoint /odds/atualizar)
    @Transactional
    public List<Game> atualizarDaApi() {
        List<Game> games = chamarApi();
        gameRepository.deleteAll();
        salvarGamesNoBanco(games);
        return games;
    }

    private List<Game> chamarApi() {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v4/sports/soccer_fifa_world_cup/odds")
                        .queryParam("apiKey", apiKey)
                        .queryParam("regions", "us")
                        .queryParam("markets", "h2h")
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Game>>() {})
                .block();
    }

    private List<Game> buscarDoBanco() {
        List<GameEntity> entities = gameRepository.findAll();
        List<Game> games = new ArrayList<>();

        for (GameEntity gameEntity : entities) {
            Game game = new Game();
            game.setHome_team(gameEntity.getHomeTeam());
            game.setAway_team(gameEntity.getAwayTeam());
            game.setSport_key(gameEntity.getSportKey());

            List<Bookmaker> bookmakers = new ArrayList<>();
            for (BookmakerEntity bookmakerEntity : gameEntity.getBookmakers()) {
                Bookmaker bookmaker = new Bookmaker();
                bookmaker.setTitle(bookmakerEntity.getTitle());

                List<Market> markets = new ArrayList<>();
                for (MarketEntity marketEntity : bookmakerEntity.getMarkets()) {
                    Market market = new Market();

                    List<Outcome> outcomes = new ArrayList<>();
                    for (OutcomeEntity outcomeEntity : marketEntity.getOutcomes()) {
                        Outcome outcome = new Outcome();
                        outcome.setName(outcomeEntity.getName());
                        outcome.setPrice(outcomeEntity.getPrice());
                        outcomes.add(outcome);
                    }

                    market.setOutcomes(outcomes);
                    markets.add(market);
                }

                bookmaker.setMarkets(markets);
                bookmakers.add(bookmaker);
            }

            game.setBookmakers(bookmakers);
            games.add(game);
        }

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
                        outcomeEntity.setMarket(marketEntity);
                        outcomeEntities.add(outcomeEntity);
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