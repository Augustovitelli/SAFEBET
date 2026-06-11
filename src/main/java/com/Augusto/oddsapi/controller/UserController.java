package com.Augusto.oddsapi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.Augusto.oddsapi.dto.UserRequestDTO;
import com.Augusto.oddsapi.service.UserService;
import java.math.BigDecimal;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/cadastro")
    public void cadastrar(@RequestBody UserRequestDTO dto) {
        userService.cadastrar(dto);
    }

    @PostMapping("/login")
    public String login(@RequestBody UserRequestDTO dto) {
        return userService.login(dto.getEmail(), dto.getSenha());
    }

    @GetMapping("/usuario/saldo")
    public BigDecimal getSaldo(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        return userService.getSaldo(token);
    }
}