package me.lapingcao.chess_web_socket_server.exceptions;

import java.util.NoSuchElementException;
import java.util.UUID;

public class GameNotFoundException extends NoSuchElementException {

    private final String errorCode;

    public GameNotFoundException(UUID gameId) {
        super("Could not find an active game with ID: " + gameId);
        this.errorCode = "GAME_NOT_FOUND";
    }

    public String getErrorCode() {
        return errorCode;
    }
}
