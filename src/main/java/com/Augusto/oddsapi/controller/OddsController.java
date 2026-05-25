package com.Augusto.oddsapi.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Augusto.oddsapi.model.Game;
import com.Augusto.oddsapi.model.Outcome;
import com.Augusto.oddsapi.service.OddsService;

@RestController
public class OddsController {

    private final OddsService oddsService;

    public OddsController(OddsService oddsService) {
        this.oddsService = oddsService;
    }

    @GetMapping("/odds")
    public String getOdds() {

        List<Game> games = oddsService.getOdds();

        StringBuilder resposta = new StringBuilder();

        for (Game game : games) {

            resposta.append("Jogo: ")
                    .append(game.getHome_team())
                    .append(" x ")
                    .append(game.getAway_team())
                    .append("\n");
            
            for (var bookmaker : game.getBookmakers()) {

                resposta.append("   Casa: ")
                        .append(bookmaker.getTitle())
                        .append("\n");
            }
            var bookmaker = game.getBookmakers().get(0);
            List<Outcome> outcomes = bookmaker.getMarkets().get(0).getOutcomes();

            for (Outcome outcome : outcomes) {

                resposta.append(outcome.getName())
                        .append(": ")
                        .append(outcome.getPrice())
                        .append("\n");
            }

            resposta.append("\n-----------------\n\n");
        }

        return "<pre>" + resposta.toString() + "</pre>";
    }
}
