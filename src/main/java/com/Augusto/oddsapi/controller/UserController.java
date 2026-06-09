package com.Augusto.oddsapi.controller;



import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;


import com.Augusto.oddsapi.dto.UserRequestDTO;
import com.Augusto.oddsapi.service.UserService;
import org.springframework.web.bind.annotation.RequestBody;


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
    public String getLogin(@RequestBody UserRequestDTO dto) {
        if (userService.login(dto.getEmail(), dto.getSenha())) {
            return "Login successful";
        } else {
            return "Login failed";
        }
    }
    
}
