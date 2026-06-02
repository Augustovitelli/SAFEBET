package com.Augusto.oddsapi.dto;

import java.util.*;

public class MarketResponseDTO {
    private List<OutcomeResponseDTO> outcomes;

    public List<OutcomeResponseDTO> getOutcomes() {
        return outcomes;
    }
    public void setOutcomes(List<OutcomeResponseDTO> outcomes) {
        this.outcomes = outcomes;
    }
}
