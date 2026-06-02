package com.Augusto.oddsapi.entity;
import jakarta.persistence.*;
import java.util.*;


@Entity
public class UserEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<BetEntity> userBets;

    private String email;
    private String password; //ver dps como armazenar a senha de forma segura 
}
