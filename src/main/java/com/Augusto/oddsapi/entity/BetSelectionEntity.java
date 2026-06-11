package com.Augusto.oddsapi.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;


@Entity
@Table(name = "bet_selections")
public class BetSelectionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @ManyToOne
    @JoinColumn(name = "game_id")
    private GameEntity game;

    @ManyToOne
    @JoinColumn(name = "bet_id")
    private BetEntity bet;

    private BigDecimal oddAtBetTime;

    private String selection;

    private String result; // OPEN, WON, LOST

    @ManyToOne
    @JoinColumn(name = "outcome_id")
    private OutcomeEntity outcome;

    public Long getId() {
        return id;
    }
    public GameEntity getGame() {
        return game;
    }
    public void setGame(GameEntity game) {
        this.game = game;
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
    public String getResult() {
        return result;
    }
    public void setResult(String result) {
        this.result = result;
    }
    public OutcomeEntity getOutcome() {
        return outcome;
    }
    public void setOutcome(OutcomeEntity outcome) {
        this.outcome = outcome;
    }
}
