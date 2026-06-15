package com.Augusto.oddsapi.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.Augusto.oddsapi.dto.BookmakerResponseDTO;
import com.Augusto.oddsapi.dto.GameResponseDTO;
import com.Augusto.oddsapi.dto.MarketResponseDTO;
import com.Augusto.oddsapi.dto.OutcomeResponseDTO;
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
    public List<GameResponseDTO> getOdds() {
        return buscarDoBanco();
    }

    // Chama API, atualiza jogos existentes e insere novos (endpoint /odds/atualizar)
    @Transactional
    public List<GameResponseDTO> atualizarDaApi() {
        List<Game> games = chamarApi();
        for (Game game : games) {
            gameRepository.findByHomeTeamAndAwayTeam(game.getHome_team(), game.getAway_team())
                    .ifPresentOrElse(
                            existing -> atualizarPrecos(existing, game),
                            () -> salvarGamesNoBanco(List.of(game))
                    );
        }
        return buscarDoBanco();
    }

    private void atualizarPrecos(GameEntity existing, Game game) {
        BigDecimal homeTeamPrice = BigDecimal.ZERO, awayTeamPrice = BigDecimal.ZERO, drawPrice = BigDecimal.ZERO;
        int countHome = 0, countAway = 0, countDraw = 0;

        for (Bookmaker bookmaker : game.getBookmakers()) {
            for (Market market : bookmaker.getMarkets()) {
                for (Outcome outcome : market.getOutcomes()) {
                    if (outcome.getName().equalsIgnoreCase(game.getHome_team())) {
                        homeTeamPrice = homeTeamPrice.add(BigDecimal.valueOf(outcome.getPrice())); countHome++;
                    } else if (outcome.getName().equalsIgnoreCase(game.getAway_team())) {
                        awayTeamPrice = awayTeamPrice.add(BigDecimal.valueOf(outcome.getPrice())); countAway++;
                    } else if (outcome.getName().equalsIgnoreCase("Draw")) {
                        drawPrice = drawPrice.add(BigDecimal.valueOf(outcome.getPrice())); countDraw++;
                    }
                }
            }
        }

        existing.setHomeTeamPrice(countHome > 0 ? homeTeamPrice.divide(BigDecimal.valueOf(countHome), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
        existing.setAwayTeamPrice(countAway > 0 ? awayTeamPrice.divide(BigDecimal.valueOf(countAway), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
        existing.setDrawPrice(countDraw > 0 ? drawPrice.divide(BigDecimal.valueOf(countDraw), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
        gameRepository.save(existing);
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

    private List<GameResponseDTO> buscarDoBanco() {
        List<GameEntity> entities = gameRepository.findAll();
        List<GameResponseDTO> games = new ArrayList<>();

        for (GameEntity gameEntity : entities) {
            GameResponseDTO dto = new GameResponseDTO();
            dto.setId(gameEntity.getId());
            dto.setHome_team(gameEntity.getHomeTeam());
            dto.setAway_team(gameEntity.getAwayTeam());
            dto.setSport_key(gameEntity.getSportKey());
            dto.setHomeTeamPrice(gameEntity.getHomeTeamPrice() != null ? gameEntity.getHomeTeamPrice() : BigDecimal.ZERO);
            dto.setAwayTeamPrice(gameEntity.getAwayTeamPrice() != null ? gameEntity.getAwayTeamPrice() : BigDecimal.ZERO);
            dto.setDrawPrice(gameEntity.getDrawPrice() != null ? gameEntity.getDrawPrice() : BigDecimal.ZERO);

            List<BookmakerResponseDTO> bookmakers = new ArrayList<>();
            for (BookmakerEntity bookmakerEntity : gameEntity.getBookmakers()) {
                BookmakerResponseDTO bookmakerDTO = new BookmakerResponseDTO();
                bookmakerDTO.setTitle(bookmakerEntity.getTitle());

                List<MarketResponseDTO> markets = new ArrayList<>();
                for (MarketEntity marketEntity : bookmakerEntity.getMarkets()) {
                    MarketResponseDTO marketDTO = new MarketResponseDTO();

                    List<OutcomeResponseDTO> outcomes = new ArrayList<>();
                    for (OutcomeEntity outcomeEntity : marketEntity.getOutcomes()) {
                        OutcomeResponseDTO outcomeDTO = new OutcomeResponseDTO();
                        outcomeDTO.setName(outcomeEntity.getName());
                        outcomeDTO.setPrice(outcomeEntity.getPrice());
                        outcomeDTO.setId(outcomeEntity.getId());
                        outcomes.add(outcomeDTO);
                    }

                    marketDTO.setOutcomes(outcomes);
                    markets.add(marketDTO);
                }

                bookmakerDTO.setMarkets(markets);
                bookmakers.add(bookmakerDTO);
            }

            dto.setBookmakers(bookmakers);
            games.add(dto);
        }

        return games;
    }

    public void salvarGamesNoBanco(List<Game> games) {
        List<GameEntity> entidades = new ArrayList<>();
        

        for (Game game : games) {

            BigDecimal homeTeamPrice = BigDecimal.ZERO;
            int countHome = 0;
            BigDecimal awayTeamPrice = BigDecimal.ZERO;
            int countAway = 0;
            BigDecimal drawPrice = BigDecimal.ZERO;
            int countDraw = 0;

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
                        if (outcome.getName().equalsIgnoreCase(game.getHome_team())) {
                            homeTeamPrice = homeTeamPrice.add(BigDecimal.valueOf(outcome.getPrice()));
                            countHome++;
                        } else if (outcome.getName().equalsIgnoreCase(game.getAway_team())) {
                            awayTeamPrice = awayTeamPrice.add(BigDecimal.valueOf(outcome.getPrice()));
                            countAway++;
                        } else if (outcome.getName().equalsIgnoreCase("Draw")) {
                            drawPrice = drawPrice.add(BigDecimal.valueOf(outcome.getPrice()));
                            countDraw++;
                        }
                    }

                    marketEntity.setOutcomes(outcomeEntities);
                    marketEntities.add(marketEntity);
                   
                }

                bookmakerEntity.setMarkets(marketEntities);
                bookmakerEntities.add(bookmakerEntity);
            }


            gameEntity.setHomeTeamPrice(countHome > 0 ? homeTeamPrice.divide(BigDecimal.valueOf(countHome), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
            gameEntity.setAwayTeamPrice(countAway > 0 ? awayTeamPrice.divide(BigDecimal.valueOf(countAway), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
            gameEntity.setDrawPrice(countDraw > 0 ? drawPrice.divide(BigDecimal.valueOf(countDraw), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO);

            gameEntity.setBookmakers(bookmakerEntities);
            entidades.add(gameEntity);
        }

        gameRepository.saveAll(entidades);
    }
    
}