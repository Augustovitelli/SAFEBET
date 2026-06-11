package com.Augusto.oddsapi.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class FootballDataMatchDTO {

    private String status;
    private Score score;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Score {
        private String winner; // "HOME_TEAM", "AWAY_TEAM", "DRAW", null

        public String getWinner() { return winner; }
        public void setWinner(String winner) { this.winner = winner; }
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Score getScore() { return score; }
    public void setScore(Score score) { this.score = score; }
}
