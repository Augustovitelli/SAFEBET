package com.Augusto.oddsapi.model;

import java.time.OffsetDateTime;
import java.util.List;

public class Game {

    private String home_team;
    private String away_team;
    private String sport_key;
    private OffsetDateTime commence_time;

    private List<Bookmaker> bookmakers;

    public String getHome_team() {
        return home_team;
    }

    public void setHome_team(String home_team) {
        this.home_team = home_team;
    }

    public String getAway_team() {
        return away_team;
    }

    public void setAway_team(String away_team) {
        this.away_team = away_team;
    }

    public String getSport_key() {
        return sport_key;
    }

    public void setSport_key(String sport_key) {
        this.sport_key = sport_key;
    }

    public OffsetDateTime getCommence_time() {
        return commence_time;
    }

    public void setCommence_time(OffsetDateTime commence_time) {
        this.commence_time = commence_time;
    }

    public List<Bookmaker> getBookmakers() {
        return bookmakers;
    }

    public void setBookmakers(List<Bookmaker> bookmakers) {
        this.bookmakers = bookmakers;
    }
}