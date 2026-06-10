package com.Augusto.oddsapi.dto;

import java.math.BigDecimal;

public class BetSelectionRequestDTO {

    private Long outcomeId;
    private BigDecimal odd;

    public Long getOutcomeId() { return outcomeId; }
    public void setOutcomeId(Long outcomeId) { this.outcomeId = outcomeId; }

    public BigDecimal getOdd() { return odd; }
    public void setOdd(BigDecimal odd) { this.odd = odd; }
}