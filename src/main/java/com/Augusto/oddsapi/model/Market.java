package com.Augusto.oddsapi.model;

import java.util.List;

public class Market {

    private List<Outcome> outcomes;

    public List<Outcome> getOutcomes() {
        return outcomes;
    }

    public void setOutcomes(List<Outcome> outcomes) {
        this.outcomes = outcomes;
    }
}