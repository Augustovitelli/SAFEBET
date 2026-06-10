package com.Augusto.oddsapi.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.Augusto.oddsapi.dto.BetResponseDTO;

import com.Augusto.oddsapi.dto.BetRequestDTO;
import com.Augusto.oddsapi.service.BetService;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController

public class BetController {
    
    private final BetService betService;

    public BetController(BetService betService) {
        this.betService = betService;
    }
     @PostMapping("/bet")
    public void apostar(@RequestBody BetRequestDTO dto,
                        @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // remove o "Bearer "
        betService.fazerAposta(dto, token);
    }
    @PostMapping("/bet/minhas-apostas")
    public List<BetResponseDTO> minhasApostas(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // remove o "Bearer "
        return betService.retornarApostas(token);
    }
}
