package me.lapingcao.chess_web_socket_server.controllers;

import java.util.UUID;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.lapingcao.chess_web_socket_server.messages.CancelRequest;
import me.lapingcao.chess_web_socket_server.messages.DrawRequest;
import me.lapingcao.chess_web_socket_server.messages.HostRequest;
import me.lapingcao.chess_web_socket_server.messages.JoinRequest;
import me.lapingcao.chess_web_socket_server.messages.MoveRequest;
import me.lapingcao.chess_web_socket_server.messages.ResignRequest;
import me.lapingcao.chess_web_socket_server.repositories.GameStateRepository;

@Controller
@Slf4j
@RequiredArgsConstructor
@MessageMapping("game")
public class GameController {

    private final GameStateRepository gameStateRepository;

    @MessageMapping("host")
    public void hostGame(@Payload HostRequest hostMessage) {
        log.debug("Host request from user {}", hostMessage.userId());
    }

    @MessageMapping("{gameId}/cancel")
    public void cancelGame(@DestinationVariable UUID gameId, @Payload CancelRequest cancelMessage) {
        log.debug("Cancel game request for game with ID {} for user {}", gameId, cancelMessage.userId());
    }

    @MessageMapping("{gameId}/join")
    public void joinGame(@DestinationVariable UUID gameId, @Payload JoinRequest joinMessage) {
        log.debug("Join game request for game with ID {} from user {}", gameId, joinMessage.userId());
    }

    @MessageMapping("{gameId}/move")
    public void movePiece(@DestinationVariable UUID gameId, @Payload MoveRequest moveMessage) {
        log.debug("Move piece request for game with ID {}", gameId);
        log.debug("Moving from square {} to {}", moveMessage.move().from(), moveMessage.move().to());
    }

    @MessageMapping("{gameId}/draw")
    public void drawGame(@DestinationVariable UUID gameId, @Payload DrawRequest drawMessage) {
        log.debug("Draw game request for game with ID {} from user {}", gameId, drawMessage.userId());
    }

    @MessageMapping("{gameId}/resign")
    public void resignGame(@DestinationVariable UUID gameId, @Payload ResignRequest resignMessage) {
        log.debug("Resign game request for game with ID {} from user {}", gameId, resignMessage.userId());
    }
}
