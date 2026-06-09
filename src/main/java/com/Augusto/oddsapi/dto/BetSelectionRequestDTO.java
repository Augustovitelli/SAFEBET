package com.Augusto.oddsapi.dto;

public class BetSelectionRequestDTO {
    private long gameId;
    private String selection;
    private BetRequestDTO bet;

    public long getGameId() {
        return gameId;
    }
    public void setGameId(long gameId) {
        this.gameId = gameId;
    }
    public String getSelection() {
        return selection;
    }
    public void setSelection(String selection) {
        this.selection = selection;
    }
    public BetRequestDTO getBet() {
        return bet;
    }
    public void setBet(BetRequestDTO bet) {
        this.bet = bet;
    }

}
