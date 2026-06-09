package com.Augusto.oddsapi.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Augusto.oddsapi.dto.GameResponseDTO;

import com.Augusto.oddsapi.service.OddsService;

@RestController
public class OddsController {

    private final OddsService oddsService;

    public OddsController(OddsService oddsService) {
        this.oddsService = oddsService;
    }

    @GetMapping("/odds")
    public List<GameResponseDTO> getOdds() {
        return oddsService.getOdds();
    }

    @GetMapping("/odds/atualizar")
    public List<GameResponseDTO> atualizarOdds() {
        return oddsService.atualizarDaApi();
    }
}