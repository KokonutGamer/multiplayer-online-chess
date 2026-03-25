package me.lapingcao.chess_web_socket_server.controllers;

import java.util.Map;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("users")
public class UserController {

    @GetMapping("generate-id")
    public Map<String, UUID> getAvailableId() {
        return Map.of("userId", UUID.randomUUID());
    }
}
