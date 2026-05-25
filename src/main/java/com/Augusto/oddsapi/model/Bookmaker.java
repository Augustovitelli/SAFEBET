package com.Augusto.oddsapi.model;

import java.util.List;

public class Bookmaker {

    private String title;

    private List<Market> markets;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<Market> getMarkets() {
        return markets;
    }

    public void setMarkets(List<Market> markets) {
        this.markets = markets;
    }
}