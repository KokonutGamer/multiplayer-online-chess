package me.lapingcao.chess_web_socket_server.controllers;

import java.security.Principal;
import java.util.UUID;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.lapingcao.chess_web_socket_server.game.Move;
import me.lapingcao.chess_web_socket_server.repositories.GameStateRepository;

@Controller
@Slf4j
@RequiredArgsConstructor
@MessageMapping("game")
public class GameController {

    private final GameStateRepository gameStateRepository;

    @MessageMapping("{gameId}/move")
    public void movePiece(@DestinationVariable UUID gameId, @Payload Move move, Principal principal) {
        log.debug("Move piece request for game with ID {}", gameId);
        log.debug("Moving from square {} to {}", move.from(), move.to());
    }

    @MessageMapping("{gameId}/draw")
    public void drawGame(@DestinationVariable UUID gameId, Principal principal) {
        log.debug("Draw game request for game with ID {} from user {}", gameId, principal.getName());
    }

    @MessageMapping("{gameId}/resign")
    public void resignGame(@DestinationVariable UUID gameId, Principal principal) {
        log.debug("Resign game request for game with ID {} from user {}", gameId, principal.getName());
    }
}
