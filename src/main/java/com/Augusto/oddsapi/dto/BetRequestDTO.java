package com.Augusto.oddsapi.dto;
import java.math.BigDecimal;
import java.util.List;

public class BetRequestDTO {
    
    private BigDecimal valorApostado;
    private List<BetSelectionRequestDTO> selections;

    
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
