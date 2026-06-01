package com.Augusto.oddsapi.entity;

import jakarta.persistence.*;
import java.util.*;

@Entity
public class GameEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //id do game vai vim da api!Mudar isso dps
    private Long id;

    private String homeTeam;
    private String awayTeam;
    private String sportKey;

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
}