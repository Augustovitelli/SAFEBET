package com.Augusto.oddsapi.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import com.Augusto.oddsapi.dto.UserRequestDTO;
import com.Augusto.oddsapi.entity.UserEntity;
import com.Augusto.oddsapi.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public void cadastrar(UserRequestDTO dto) {
        UserEntity user = new UserEntity();
        user.setUserName(dto.getUserName());
        UserEntity existingUser = userRepository.findByEmail(dto.getEmail());
        if (existingUser != null) {
            throw new IllegalArgumentException("Email já cadastrado");
        }else {
            user.setEmail(dto.getEmail());
        }
        user.setSenha(passwordEncoder.encode(dto.getSenha()));
        user.setSaldo(new BigDecimal("1000.00"));

        userRepository.save(user);
    }

    public String login(String email, String senha) {
        UserEntity user = userRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(senha, user.getSenha())) {
            return jwtService.gerarToken(email, user.getId());
        }
        throw new IllegalArgumentException("Email ou senha incorretos");
    }

    public BigDecimal getSaldo(String token) {
        Long userId = jwtService.extrairUserId(token);
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"))
                .getSaldo();
    }
}