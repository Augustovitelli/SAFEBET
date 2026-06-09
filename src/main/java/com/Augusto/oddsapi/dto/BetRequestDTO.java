package com.Augusto.oddsapi.dto;
import java.math.BigDecimal;
import java.util.List;

public class BetRequestDTO {
    private Long userId;
    private BigDecimal valorApostado;
    private List<BetSelectionRequestDTO> selections;

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public BigDecimal getValorApostado() {
        return valorApostado;
    }
    public void setValorApostado(BigDecimal valorApostado) {
        this.valorApostado = valorApostado;
    }
    public List<BetSelectionRequestDTO> getSelections() {
        return selections;
    }
    public void setSelections(List<BetSelectionRequestDTO> selections) {
        this.selections = selections;
    }
}
