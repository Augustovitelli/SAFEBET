package com.Augusto.oddsapi.entity;

import jakarta.persistence.*;
import java.util.*;
import java.time.LocalDateTime;

@Entity
public class BookmakerEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    private String title;
    @ManyToOne
    @JoinColumn(name = "game_id")
    private GameEntity game;
    private LocalDateTime lastUpdate;
    @OneToMany(mappedBy = "bookmaker", cascade = CascadeType.ALL)
    private List<MarketEntity> markets;

    public Long getId() {
        return id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title; 
    }
    public GameEntity getGame() {
        return game;
    }
    public void setGame(GameEntity game) {
        this.game = game;
    }
    public LocalDateTime getLastUpdate() {
        return lastUpdate;
    }
    public void setLastUpdate(LocalDateTime lastUpdate) {
        this.lastUpdate = lastUpdate;
    }
    public List<MarketEntity> getMarkets() {
        return markets;
    }
    public void setMarkets(List<MarketEntity> markets) {
        this.markets = markets;
    }

}