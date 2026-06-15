package com.Augusto.oddsapi.controller;

import com.Augusto.oddsapi.service.ResultService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/results")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    // Mapeia um jogo do nosso banco com o ID da football-data.org
    // PATCH /results/games/3/football-data-id?footballDataMatchId=492074
    @PatchMapping("/games/{gameId}/football-data-id")
    public ResponseEntity<String> mapearFootballDataId(
            @PathVariable Long gameId,
            @RequestParam String footballDataMatchId) {
        resultService.mapearFootballDataId(gameId, footballDataMatchId);
        return ResponseEntity.ok("Mapeamento salvo com sucesso");
    }

    // Busca o resultado na football-data.org e resolve as apostas
    // POST /results/resolve/492074
    @PostMapping("/resolve/{footballDataMatchId}")
    public ResponseEntity<String> resolveMatch(@PathVariable String footballDataMatchId) {
        resultService.resolveMatch(footballDataMatchId);
        return ResponseEntity.ok("Apostas resolvidas com sucesso");
    }

    // Mapeia automaticamente os jogos do banco com os IDs da worldcup26.ir por nome de time
    // POST /results/auto-map
    @PostMapping("/auto-map")
    public ResponseEntity<Map<String, List<String>>> autoMapearJogos() {
        return ResponseEntity.ok(resultService.autoMapearJogos());
    }
}
