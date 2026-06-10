package com.Augusto.oddsapi.service;

import com.Augusto.oddsapi.repository.OutcomeRepository;
import com.Augusto.oddsapi.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.Augusto.oddsapi.entity.BetEntity;
import com.Augusto.oddsapi.entity.BetSelectionEntity;
import com.Augusto.oddsapi.entity.UserEntity;
import com.Augusto.oddsapi.dto.BetSelectionResponseDTO;

import java.util.ArrayList;
import java.util.List;
import com.Augusto.oddsapi.dto.BetResponseDTO;
import com.Augusto.oddsapi.dto.BetRequestDTO;
import com.Augusto.oddsapi.repository.BetRepository;
import com.Augusto.oddsapi.repository.BetSelectionRepository;
import java.math.BigDecimal;

@Service
public class BetService {

    private final OutcomeRepository outcomeRepository;
    private final UserRepository userRepository;
    private final BetRepository betRepository;
    private final BetSelectionRepository betSelectionRepository;
    private final JwtService jwtService;

    public BetService(BetRepository betRepository, BetSelectionRepository betSelectionRepository,
                      UserRepository userRepository, OutcomeRepository outcomeRepository,
                      JwtService jwtService) {
        this.betRepository = betRepository;
        this.betSelectionRepository = betSelectionRepository;
        this.userRepository = userRepository;
        this.outcomeRepository = outcomeRepository;
        this.jwtService = jwtService;
    }

    public void fazerAposta(BetRequestDTO dto, String token) {
        Long userId = jwtService.extrairUserId(token); // ✅ extrai do token

        if (userRepository.findById(userId).isPresent()) {
            UserEntity user = userRepository.findById(userId).get();
            BetEntity bet = new BetEntity();
            bet.setUser(user);

            if (user.getSaldo().compareTo(dto.getValorApostado()) >= 0) {

                user.setSaldo(user.getSaldo().subtract(dto.getValorApostado()));
                userRepository.save(user);

                bet.setValorApostado(dto.getValorApostado());
                bet.setStatus("OPEN");
                BigDecimal oddTotal = BigDecimal.ONE;
                betRepository.save(bet);

                for (var selectionDTO : dto.getSelections()) {
                    BetSelectionEntity selection = new BetSelectionEntity();
                    selection.setOutcome(outcomeRepository.findById(selectionDTO.getOutcomeId()).get());
                    oddTotal = oddTotal.multiply(selectionDTO.getOdd());
                    selection.setOddAtBetTime(selectionDTO.getOdd());
                    selection.setBet(bet);
                    selection.setSelection(selection.getOutcome().getName());
                    bet.getSelections().add(selection);
                    betSelectionRepository.save(selection);
                }

                bet.setOddTotal(oddTotal);
                bet.setPossibleReturn(oddTotal.multiply(dto.getValorApostado()));
                betRepository.save(bet);

            } else {
                throw new IllegalArgumentException("Saldo insuficiente");
            }
        } else {
            throw new IllegalArgumentException("Usuário não encontrado");
        }
    }

    public List<BetResponseDTO> retornarApostas(String token) {

    Long userId = jwtService.extrairUserId(token);

    List<BetEntity> bets =
            betRepository.findByUserId(userId);

    List<BetResponseDTO> response =
            new ArrayList<>();

    for (BetEntity bet : bets) {

        BetResponseDTO dto =
                new BetResponseDTO();

        dto.setId(
                bet.getId()
        );

        dto.setValorApostado(
                bet.getValorApostado()
        );

        dto.setOddTotal(
                bet.getOddTotal()
        );

        dto.setPossibleReturn(
                bet.getPossibleReturn()
        );

        dto.setStatus(
                bet.getStatus()
        );

        List<BetSelectionResponseDTO> selections =
                bet.getSelections()
                        .stream()
                        .map(selection -> {

                            BetSelectionResponseDTO selectionDTO =
                                    new BetSelectionResponseDTO();

                            selectionDTO.setSelection(
                                    selection.getSelection()
                            );
                            

                            selectionDTO.setOddAtBetTime(
                                    selection.getOddAtBetTime()
                            );

                            return selectionDTO;

                        })
                        .toList();

        dto.setSelections(
                selections
        );

        response.add(
                dto
        );
    }

    return response;
}
}