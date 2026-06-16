package com.Augusto.oddsapi.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.*;

public class GameResponseDTO {

    private Long id;
    private String home_team;
    private String away_team;
    private String sport_key;
    private BigDecimal homeTeamPrice;
    private BigDecimal awayTeamPrice;
    private BigDecimal drawPrice;
    private OffsetDateTime commenceTime;
    private List<BookmakerResponseDTO> bookmakers;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }


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
    public BigDecimal getHomeTeamPrice() {
        return homeTeamPrice;
    }
    public void setHomeTeamPrice(BigDecimal homeTeamPrice) {
        this.homeTeamPrice = homeTeamPrice;
    }
    public BigDecimal getAwayTeamPrice() {
        return awayTeamPrice;
    }
    public void setAwayTeamPrice(BigDecimal awayTeamPrice) {
        this.awayTeamPrice = awayTeamPrice;
    }
    public BigDecimal getDrawPrice() {
        return drawPrice;
    }
    public void setDrawPrice(BigDecimal drawPrice) {
        this.drawPrice = drawPrice;
    }
    public OffsetDateTime getCommenceTime() {
        return commenceTime;
    }
    public void setCommenceTime(OffsetDateTime commenceTime) {
        this.commenceTime = commenceTime;
    }
}
