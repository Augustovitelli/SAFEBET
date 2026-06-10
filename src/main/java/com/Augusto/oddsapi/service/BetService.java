package com.Augusto.oddsapi.service;
import com.Augusto.oddsapi.repository.OutcomeRepository;
import com.Augusto.oddsapi.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.Augusto.oddsapi.entity.BetEntity;
import com.Augusto.oddsapi.entity.BetSelectionEntity;
import com.Augusto.oddsapi.entity.UserEntity;

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
    


    public BetService(BetRepository betRepository, BetSelectionRepository betSelectionRepository, UserRepository userRepository,OutcomeRepository outcomeRepository) {
        this.betRepository = betRepository;
        this.betSelectionRepository = betSelectionRepository;
        this.userRepository = userRepository;
        this.outcomeRepository = outcomeRepository;
    }

    public void fazerAposta(BetRequestDTO dto) {
        if(userRepository.findById(dto.getUserId()).isPresent()) {
            UserEntity user = userRepository.findById(dto.getUserId()).get();
            BetEntity bet = new BetEntity();
            bet.setUser(user);

            if(user.getSaldo().compareTo(dto.getValorApostado()) >= 0) {
                
                user.setSaldo(user.getSaldo().subtract(dto.getValorApostado()));
                userRepository.save(user);

                bet.setValorApostado(dto.getValorApostado());
                BigDecimal oddTotal = BigDecimal.ONE;
                betRepository.save(bet); // Salva a aposta para gerar o ID necessário para as seleções

                for(var selectionDTO : dto.getSelections()) {
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
                bet.setStatus("OPEN");
                betRepository.save(bet);

            } else {
                throw new IllegalArgumentException("Valor apostado is required");
            }
        } else {
            throw new IllegalArgumentException("User not found");
        }

    }
    public List<BetResponseDTO> retornarApostas() {
        //como pegar as de um usuario especifico? jwt talvez em td isso
        return null;
    }
}
