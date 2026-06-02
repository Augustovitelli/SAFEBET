package com.Augusto.oddsapi.dto;

import java.util.*;

public class GameResponseDTO {
    
    private String home_team;
    private String away_team;
    private String sport_key;
    private List<BookmakerResponseDTO> bookmakers;


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
    public List<BookmakerResponseDTO> getBookmakers() {
        return bookmakers;
    }
    public void setBookmakers(List<BookmakerResponseDTO> bookmakers) {
        this.bookmakers = bookmakers;
    }
}
