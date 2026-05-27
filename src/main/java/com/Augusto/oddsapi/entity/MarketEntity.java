package com.Augusto.oddsapi.entity;

import jakarta.persistence.*;
import java.util.*;
import java.time.LocalDateTime;

@Entity
public class MarketEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    private LocalDateTime lastUpdate;
    @ManyToOne
    @JoinColumn(name = "bookmaker_id")
    private BookmakerEntity bookmaker;
    @OneToMany(mappedBy = "market", cascade = CascadeType.ALL)
    private List<OutcomeEntity> outcomes;

    public Long getId() {
        return id;
    }


    public LocalDateTime getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(LocalDateTime lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    public BookmakerEntity getBookmaker() {
        return bookmaker;
    }

    public void setBookmaker(BookmakerEntity bookmaker) {
        this.bookmaker = bookmaker;
    }

    public List<OutcomeEntity> getOutcomes() {
        return outcomes;
    }

    public void setOutcomes(List<OutcomeEntity> outcomes) {
        this.outcomes = outcomes;
    }
}
