package com.Augusto.oddsapi.entity;
import jakarta.persistence.*;
import java.util.*;
import java.math.BigDecimal;


@Entity
public class UserEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;
    private BigDecimal saldo;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<BetEntity> userBets = new ArrayList<>();
    

    private String email;
    private String senha; 

    public Long getId() {
        return id;
    }

    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }

    public BigDecimal getSaldo() {
        return saldo;
    }

    public void setSaldo(BigDecimal saldo) {
        this.saldo = saldo;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
    public List<BetEntity> getUserBets() {
        return userBets;
    }
    public void setUserBets(List<BetEntity> userBets) {
        this.userBets = userBets;
    }
}
