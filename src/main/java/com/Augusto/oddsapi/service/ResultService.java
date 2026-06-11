package com.Augusto.oddsapi.service;

import com.Augusto.oddsapi.dto.FootballDataMatchDTO;
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

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ResultService {

    private final FootballDataService footballDataService;
    private final GameRepository gameRepository;
    private final BetSelectionRepository betSelectionRepository;
    private final BetRepository betRepository;
    private final UserRepository userRepository;

    public ResultService(FootballDataService footballDataService,
                         GameRepository gameRepository,
                         BetSelectionRepository betSelectionRepository,
                         BetRepository betRepository,
                         UserRepository userRepository) {
        this.footballDataService = footballDataService;
        this.gameRepository = gameRepository;
        this.betSelectionRepository = betSelectionRepository;
        this.betRepository = betRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void resolveMatch(String footballDataMatchId) {
        FootballDataMatchDTO match = footballDataService.getMatch(footballDataMatchId);

        if (match.getScore() == null || match.getScore().getWinner() == null) {
            throw new IllegalStateException("Jogo ainda não finalizado");
        }

        GameEntity game = gameRepository.findByFootballDataId(footballDataMatchId)
                .orElseThrow(() -> new RuntimeException("Jogo não mapeado com footballDataId: " + footballDataMatchId));

        String winnerName = switch (match.getScore().getWinner()) {
            case "HOME_TEAM" -> game.getHomeTeam();
            case "AWAY_TEAM" -> game.getAwayTeam();
            case "DRAW" -> "Draw";
            default -> throw new IllegalStateException("Winner desconhecido: " + match.getScore().getWinner());
        };

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
}
