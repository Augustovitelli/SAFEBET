package com.Augusto.oddsapi.entity;
import jakarta.persistence.*;
import java.util.*;

@Entity
public class BetEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;
    private String ganhador;
    //tirar duvida prof sobre como fazer o usuario e a bet.
}
