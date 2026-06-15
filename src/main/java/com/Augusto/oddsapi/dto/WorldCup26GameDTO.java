package com.Augusto.oddsapi.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WorldCup26GameDTO {

    private String id;

    @JsonProperty("home_score")
    private String homeScore;

    @JsonProperty("away_score")
    private String awayScore;

    private String finished;

    @JsonProperty("home_team_name_en")
    private String homeTeamNameEn;

    @JsonProperty("away_team_name_en")
    private String awayTeamNameEn;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getHomeScore() { return homeScore; }
    public void setHomeScore(String homeScore) { this.homeScore = homeScore; }

    public String getAwayScore() { return awayScore; }
    public void setAwayScore(String awayScore) { this.awayScore = awayScore; }

    public String getFinished() { return finished; }
    public void setFinished(String finished) { this.finished = finished; }

    public String getHomeTeamNameEn() { return homeTeamNameEn; }
    public void setHomeTeamNameEn(String homeTeamNameEn) { this.homeTeamNameEn = homeTeamNameEn; }

    public String getAwayTeamNameEn() { return awayTeamNameEn; }
    public void setAwayTeamNameEn(String awayTeamNameEn) { this.awayTeamNameEn = awayTeamNameEn; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Response {
        private List<WorldCup26GameDTO> games;

        public List<WorldCup26GameDTO> getGames() { return games; }
        public void setGames(List<WorldCup26GameDTO> games) { this.games = games; }
    }
}
