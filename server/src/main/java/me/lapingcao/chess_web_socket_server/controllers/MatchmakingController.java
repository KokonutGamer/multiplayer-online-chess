package me.lapingcao.chess_web_socket_server.controllers;

import java.security.Principal;
import java.util.UUID;

import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.lapingcao.chess_web_socket_server.messages.NewGameMessage;
import me.lapingcao.chess_web_socket_server.services.MatchmakingService;

@Controller
@Slf4j
@RequiredArgsConstructor
@MessageMapping("matchmaking")
public class MatchmakingController {

    private final MatchmakingService matchmakingService;

    /**
     * TODO document hostGame method
     * 
     * The {@code @SendToUser} annotation is defined with a {@code destinations}
     * attribute and a {@code broadcast} attribute. Setting {@code broadcast} to
     * false prevents multiple sessions tied to one user receiving the message. This
     * way, if a user decides to play multiple games at a time, the messages from
     * one game will not interface with the messages from another game since each
     * game should require a separate WebSocket session.
     * 
     * @param principal
     */
    @MessageMapping("host")
    @SendToUser(destinations="/queue/matchmaking", broadcast=false)
    public NewGameMessage hostGame(Principal principal) {
        log.debug("Host request from user {}", principal.getName());
        UUID gameId = matchmakingService.hostGame(UUID.fromString(principal.getName()));
        return new NewGameMessage(gameId);
    }

    @MessageMapping("join")
    @SendToUser(destinations="/queue/matchmaking", broadcast=false)
    public void joinGame(@Header("gameId") UUID gameId, Principal principal) {
        log.debug("Join request from user {} to game {}", principal.getName(), gameId);
    }

    @MessageMapping("cancel")
    @SendToUser(destinations="/queue/matchmaking", broadcast=false)
    public void cancelGame(@Header("gameId") UUID gameId, Principal principal) {
        log.debug("Cancel request from user {} for game {}", principal.getName(), gameId);
    }
}
