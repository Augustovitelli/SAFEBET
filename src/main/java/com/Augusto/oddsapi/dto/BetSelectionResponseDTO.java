package com.Augusto.oddsapi.dto;

import java.math.BigDecimal;

public class BetSelectionResponseDTO {

    private Long id;
    private String selection;
    private BigDecimal oddAtBetTime;

    // getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSelection() { return selection; }
    public void setSelection(String selection) { this.selection = selection; }

    public BigDecimal getOddAtBetTime() { return oddAtBetTime; }
    public void setOddAtBetTime(BigDecimal oddAtBetTime) { this.oddAtBetTime = oddAtBetTime; }
}