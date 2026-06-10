package com.Augusto.oddsapi.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;


@Entity
@Table(name = "bet_selections")
public class BetSelectionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    private long gameId;

    @ManyToOne
    @JoinColumn(name = "bet_id")
    private BetEntity bet;

    private BigDecimal oddAtBetTime;

    private String selection;

    @ManyToOne
    @JoinColumn(name = "outcome_id")
    private OutcomeEntity outcome;

    // getters e setters
    public Long getId() {
        return id;
    }
    public BetEntity getBet() {
        return bet;
    }
    public void setBet(BetEntity bet) {
        this.bet = bet;
    }
    public BigDecimal getOddAtBetTime() {
        return oddAtBetTime;
    }
    public void setOddAtBetTime(BigDecimal oddAtBetTime) {
        this.oddAtBetTime = oddAtBetTime;
    }
    public String getSelection() {
        return selection;
    }
    public void setSelection(String selection) {
        this.selection = selection;
    }
    public OutcomeEntity getOutcome() {
        return outcome;
    }
    public void setOutcome(OutcomeEntity outcome) {
        this.outcome = outcome;
    }
    public long getGameId() {
        return gameId;
    }
    public void setGameId(long gameId) {
        this.gameId = gameId;
    }
}
