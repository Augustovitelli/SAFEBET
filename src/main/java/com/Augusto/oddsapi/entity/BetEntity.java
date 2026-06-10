package com.Augusto.oddsapi.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bets")
public class BetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    private BigDecimal valorApostado;

    private BigDecimal oddTotal;

    private BigDecimal possibleReturn;

    private String status; //OPEN, WON, LOST

    

    @OneToMany(mappedBy = "bet", cascade = CascadeType.ALL)
    private List<BetSelectionEntity> selections = new ArrayList<>();

    public Long getId() {
        return id;
    }
    public UserEntity getUser() {
        return user;
    }
    public void setUser(UserEntity user) {
        this.user = user;
    }
    public BigDecimal getValorApostado() {
        return valorApostado;
    }
    public void setValorApostado(BigDecimal valorApostado) {
        this.valorApostado = valorApostado;
    }
    public BigDecimal getOddTotal() {
        return oddTotal;
    }
    public void setOddTotal(BigDecimal oddTotal) {
        this.oddTotal = oddTotal;
    }
    public BigDecimal getPossibleReturn() {
        return possibleReturn;
    }
    public void setPossibleReturn(BigDecimal possibleReturn) {
        this.possibleReturn = possibleReturn;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public List<BetSelectionEntity> getSelections() {
        return selections;
    }
    public void setSelections(List<BetSelectionEntity> selections) {
        this.selections = selections;
    }
}