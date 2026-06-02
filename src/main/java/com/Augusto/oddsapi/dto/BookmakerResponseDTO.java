package com.Augusto.oddsapi.dto;
import java.util.*;

public class BookmakerResponseDTO {
    
    private String title;
    private List<MarketResponseDTO> markets;


    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title; 
    }
    public List<MarketResponseDTO> getMarkets() {
        return markets;
    }
    public void setMarkets(List<MarketResponseDTO> markets) {
        this.markets = markets;
    }
}
