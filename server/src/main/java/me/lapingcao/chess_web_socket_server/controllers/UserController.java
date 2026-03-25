package me.lapingcao.chess_web_socket_server.controllers;

import java.util.Map;
import java.util.UUID;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("users")
@CrossOrigin(originPatterns = { "http://*localhost:[*]" }, methods = { RequestMethod.GET })
public class UserController {

    // TODO use an in-memory set to check if a UUID exists; will need to change this to a POST later since this should not be idempotent
    @GetMapping("generate-id")
    public Map<String, UUID> getAvailableId() {
        return Map.of("userId", UUID.randomUUID());
    }
}
