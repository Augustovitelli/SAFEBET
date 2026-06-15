package com.Augusto.oddsapi.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.*;

@Entity
public class GameEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //id do game vai vim da api!Mudar isso dps
    private Long id;

    private String homeTeam;
    private String awayTeam;
    private String sportKey;

    private BigDecimal homeTeamPrice;
    private BigDecimal awayTeamPrice;
    private BigDecimal drawPrice;

    private String footballDataId;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    private List<BookmakerEntity> bookmakers;

    public Long getId() {
        return id;
    }

    public String getHomeTeam() {
        return homeTeam;
    }

    public void setHomeTeam(String homeTeam) {
        this.homeTeam = homeTeam;
    }

    public String getAwayTeam() {
        return awayTeam;
    }

    public void setAwayTeam(String awayTeam) {
        this.awayTeam = awayTeam;
    }

    

    public String getSportKey() {
        return sportKey;
    }

    public void setSportKey(String sportKey) {
        this.sportKey = sportKey;
    }

    public List<BookmakerEntity> getBookmakers() {
        return bookmakers;
    }

    public void setBookmakers(List<BookmakerEntity> bookmakers) {
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
    public String getFootballDataId() {
        return footballDataId;
    }
    public void setFootballDataId(String footballDataId) {
        this.footballDataId = footballDataId;
    }
}