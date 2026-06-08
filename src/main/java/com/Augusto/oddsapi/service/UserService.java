
package com.Augusto.oddsapi.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.Augusto.oddsapi.dto.UserRequestDTO;
import com.Augusto.oddsapi.dto.BookmakerResponseDTO;
import com.Augusto.oddsapi.dto.GameResponseDTO;
import com.Augusto.oddsapi.dto.MarketResponseDTO;
import com.Augusto.oddsapi.dto.OutcomeResponseDTO;
import com.Augusto.oddsapi.entity.BookmakerEntity;
import com.Augusto.oddsapi.entity.GameEntity;
import com.Augusto.oddsapi.entity.MarketEntity;
import com.Augusto.oddsapi.entity.OutcomeEntity;
import com.Augusto.oddsapi.entity.UserEntity;
import com.Augusto.oddsapi.model.Bookmaker;
import com.Augusto.oddsapi.model.Game;
import com.Augusto.oddsapi.model.Market;
import com.Augusto.oddsapi.model.Outcome;
import com.Augusto.oddsapi.repository.GameRepository;
import com.Augusto.oddsapi.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void cadastrar(UserRequestDTO dto) {
        UserEntity user = new UserEntity();
        user.setUserName(dto.getUserName());
        user.setEmail(dto.getEmail());
        user.setSenha(passwordEncoder.encode(dto.getSenha())); // ✅ hash aqui
        user.setSaldo(new java.math.BigDecimal("1000.00")); // Saldo inicial
        

        userRepository.save(user);
    }
    public boolean login(String email, String senha){
        UserEntity user = userRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(senha, user.getSenha())) {
            return true;
        }
        return false;
    }

}
