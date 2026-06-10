package com.Augusto.oddsapi.dto;

import java.math.BigDecimal;
import java.util.List;

public class BetResponseDTO {

    private Long id;
    private BigDecimal valorApostado;
    private BigDecimal oddTotal;
    private BigDecimal possibleReturn;
    private String status;
    private List<BetSelectionResponseDTO> selections;

    // getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public BigDecimal getValorApostado() { return valorApostado; }
    public void setValorApostado(BigDecimal valorApostado) { this.valorApostado = valorApostado; }

    public BigDecimal getOddTotal() { return oddTotal; }
    public void setOddTotal(BigDecimal oddTotal) { this.oddTotal = oddTotal; }

    public BigDecimal getPossibleReturn() { return possibleReturn; }
    public void setPossibleReturn(BigDecimal possibleReturn) { this.possibleReturn = possibleReturn; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    
    public List<BetSelectionResponseDTO> getSelections() { return selections; }
    public void setSelections(List<BetSelectionResponseDTO> selections) { this.selections = selections; }
}