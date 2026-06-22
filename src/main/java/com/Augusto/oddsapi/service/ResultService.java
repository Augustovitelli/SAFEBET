package com.Augusto.oddsapi.service;

import com.Augusto.oddsapi.dto.WorldCup26GameDTO;
import com.Augusto.oddsapi.entity.BetEntity;
import com.Augusto.oddsapi.entity.BetSelectionEntity;
import com.Augusto.oddsapi.entity.GameEntity;
import com.Augusto.oddsapi.entity.UserEntity;
import com.Augusto.oddsapi.repository.BetRepository;
import com.Augusto.oddsapi.repository.BetSelectionRepository;
import com.Augusto.oddsapi.repository.GameRepository;
import com.Augusto.oddsapi.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import org.springframework.scheduling.annotation.Scheduled;
import java.time.OffsetDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ResultService {

    private final WorldCup26Service worldCup26Service;
    private final GameRepository gameRepository;
    private final BetSelectionRepository betSelectionRepository;
    private final BetRepository betRepository;
    private final UserRepository userRepository;
    private final Logger log = LoggerFactory.getLogger(ResultService.class);

    public ResultService(WorldCup26Service worldCup26Service,
                         GameRepository gameRepository,
                         BetSelectionRepository betSelectionRepository,
                         BetRepository betRepository,
                         UserRepository userRepository) {
        this.worldCup26Service = worldCup26Service;
        this.gameRepository = gameRepository;
        this.betSelectionRepository = betSelectionRepository;
        this.betRepository = betRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void resolveMatch(String footballDataMatchId) {
        resolveMatchComDados(footballDataMatchId, worldCup26Service.getAllGames());
    }

    private void resolveMatchComDados(String footballDataMatchId, List<WorldCup26GameDTO> apiGames) {
        WorldCup26GameDTO apiGame = apiGames.stream()
                .filter(g -> footballDataMatchId.equals(g.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Jogo não encontrado na API: " + footballDataMatchId));

        String finished = apiGame.getFinished();
        if (finished == null || finished.isBlank() || "false".equalsIgnoreCase(finished) || "0".equals(finished)) {
            throw new IllegalStateException("Jogo ainda não finalizado");
        }

        String homeScoreStr = apiGame.getHomeScore();
        String awayScoreStr = apiGame.getAwayScore();
        if (homeScoreStr == null || homeScoreStr.isBlank() || awayScoreStr == null || awayScoreStr.isBlank()) {
            throw new IllegalStateException("Placar não disponível");
        }

        int homeScore = (int) Double.parseDouble(homeScoreStr.trim());
        int awayScore = (int) Double.parseDouble(awayScoreStr.trim());

        GameEntity game = gameRepository.findByFootballDataId(footballDataMatchId)
                .orElseThrow(() -> new RuntimeException("Jogo não mapeado com id: " + footballDataMatchId));

        // A API pode ter home/away invertido em relação ao nosso banco
        boolean invertido = apiGame.getHomeTeamNameEn() != null
                && !corresponde(normalizar(game.getHomeTeam()), normalizar(apiGame.getHomeTeamNameEn()));
        int scoreDoHomeNoBanco   = invertido ? awayScore : homeScore;
        int scoreDoAwayNoBanco   = invertido ? homeScore : awayScore;

        String winnerName;
        if (scoreDoHomeNoBanco > scoreDoAwayNoBanco) {
            winnerName = game.getHomeTeam();
        } else if (scoreDoAwayNoBanco > scoreDoHomeNoBanco) {
            winnerName = game.getAwayTeam();
        } else {
            winnerName = "Draw";
        }

        List<BetSelectionEntity> openSelections =
                betSelectionRepository.findOpenByGameFootballDataId(footballDataMatchId);

        for (BetSelectionEntity selection : openSelections) {
            boolean won = selection.getSelection().equalsIgnoreCase(winnerName);
            selection.setResult(won ? "WON" : "LOST");
            betSelectionRepository.save(selection);
        }

        Set<BetEntity> affectedBets = openSelections.stream()
                .map(BetSelectionEntity::getBet)
                .collect(Collectors.toSet());

        for (BetEntity bet : affectedBets) {
            List<BetSelectionEntity> allSelections = bet.getSelections();

            boolean anyLost = allSelections.stream().anyMatch(s -> "LOST".equals(s.getResult()));
            boolean allWon = allSelections.stream().allMatch(s -> "WON".equals(s.getResult()));

            if (anyLost) {
                bet.setStatus("LOST");
                betRepository.save(bet);
            } else if (allWon) {
                bet.setStatus("WON");
                UserEntity user = bet.getUser();
                user.setSaldo(user.getSaldo().add(bet.getPossibleReturn()));
                userRepository.save(user);
                betRepository.save(bet);
            }
            // se ainda tem seleções OPEN (acumulador com outros jogos), mantém OPEN
        }
    }

    @Transactional
    public void mapearFootballDataId(Long gameId, String footballDataMatchId) {
        GameEntity game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Jogo não encontrado: " + gameId));
        game.setFootballDataId(footballDataMatchId);
        gameRepository.save(game);
    }

    @Transactional
    public Map<String, List<String>> autoMapearJogos() {
        return autoMapearJogosComLista(worldCup26Service.getAllGames());
    }

    private Map<String, List<String>> autoMapearJogosComLista(List<WorldCup26GameDTO> apiGames) {
        List<GameEntity> dbGames = gameRepository.findAll();

        List<String> mapeados = new ArrayList<>();
        List<String> naoEncontrados = new ArrayList<>();

        for (GameEntity dbGame : dbGames) {
            if (dbGame.getFootballDataId() != null && !dbGame.getFootballDataId().isBlank()) {
                continue;
            }

            String homeNorm = normalizar(dbGame.getHomeTeam());
            String awayNorm = normalizar(dbGame.getAwayTeam());

            WorldCup26GameDTO match = apiGames.stream()
                    .filter(g -> g.getHomeTeamNameEn() != null && !g.getHomeTeamNameEn().isBlank()
                              && g.getAwayTeamNameEn() != null && !g.getAwayTeamNameEn().isBlank())
                    .filter(g -> {
                        String apiHome = normalizar(g.getHomeTeamNameEn());
                        String apiAway = normalizar(g.getAwayTeamNameEn());
                        return (corresponde(homeNorm, apiHome) && corresponde(awayNorm, apiAway))
                            || (corresponde(homeNorm, apiAway) && corresponde(awayNorm, apiHome));
                    })
                    .findFirst()
                    .orElse(null);

            if (match != null) {
                dbGame.setFootballDataId(match.getId());
                gameRepository.save(dbGame);
                mapeados.add(dbGame.getHomeTeam() + " vs " + dbGame.getAwayTeam() + " → " + match.getId());
                log.info("Jogo mapeado: {} vs {} → {}", dbGame.getHomeTeam(), dbGame.getAwayTeam(), match.getId());
            } else {
                naoEncontrados.add(dbGame.getHomeTeam() + " vs " + dbGame.getAwayTeam());
                log.warn("Jogo não encontrado na API: {} vs {} (home_norm='{}', away_norm='{}')",
                        dbGame.getHomeTeam(), dbGame.getAwayTeam(), homeNorm, awayNorm);
            }
        }

        Map<String, List<String>> resultado = new HashMap<>();
        resultado.put("mapeados", mapeados);
        resultado.put("nao_encontrados", naoEncontrados);
        return resultado;
    }

    private String normalizar(String nome) {
        if (nome == null) return "";
        return nome.toLowerCase().trim()
                .replaceAll("&", " and ")
                .replaceAll("[áàãâä]", "a")
                .replaceAll("[éèêë]", "e")
                .replaceAll("[íìîï]", "i")
                .replaceAll("[óòõôö]", "o")
                .replaceAll("[úùûü]", "u")
                .replaceAll("[ç]", "c")
                .replaceAll("[^a-z0-9 ]", "")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private boolean corresponde(String a, String b) {
        if (a.equals(b)) return true;
        return a.contains(b) || b.contains(a);
    }

    @Scheduled(fixedDelay = 5000) // roda a cada 5 minutos
    @Transactional
    public void resolverApostasAutomaticamente() {
        List<WorldCup26GameDTO> apiGames;
        try {
            apiGames = worldCup26Service.getAllGames();
        } catch (Exception e) {
            log.warn("Falha ao buscar jogos da API worldcup26: {}", e.getMessage());
            return;
        }

        autoMapearJogosComLista(apiGames);

        List<GameEntity> jogosPassados = gameRepository
                .findByCommenceTimeBeforeAndFootballDataIdNotNull(OffsetDateTime.now());

        for (GameEntity game : jogosPassados) {
            List<BetSelectionEntity> abertas = betSelectionRepository
                    .findOpenByGameFootballDataId(game.getFootballDataId());

            if (abertas.isEmpty()) continue;

            try {
                resolveMatchComDados(game.getFootballDataId(), apiGames);
                log.info("Apostas resolvidas: {} vs {}", game.getHomeTeam(), game.getAwayTeam());
            } catch (IllegalStateException e) {
                log.info("Jogo ainda não finalizado: {} vs {}", game.getHomeTeam(), game.getAwayTeam());
            } catch (Exception e) {
                log.error("Erro ao resolver {} vs {} (footballDataId={}): {} - {}",
                        game.getHomeTeam(), game.getAwayTeam(), game.getFootballDataId(),
                        e.getClass().getSimpleName(), e.getMessage());
            }
        }
    }

}
