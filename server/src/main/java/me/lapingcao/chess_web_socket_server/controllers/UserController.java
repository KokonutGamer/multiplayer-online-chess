package me.lapingcao.chess_web_socket_server.controllers;

import java.util.Map;
import java.util.UUID;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.lapingcao.chess_web_socket_server.services.JwtVerifierService;

/**
 * TODO document UserController @RestController
 */
@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("users")
@CrossOrigin(originPatterns = { "http://*localhost:[*]" }, methods = { RequestMethod.GET })
public class UserController {

    /**
     * TODO document jwtVerifierService member
     */
    private final JwtVerifierService jwtVerifierService;

    // TODO use an in-memory set to check if a UUID exists; will need to change this
    // to a POST later since this should not be idempotent
    @PostMapping("generate-id")
    public Map<String, String> getAvailableId() {
        UUID newUserId = UUID.randomUUID();
        return Map.of("accessToken", jwtVerifierService.signUser(newUserId));
    }
}
