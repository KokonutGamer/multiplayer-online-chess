package me.lapingcao.chess_web_socket_server.messages;

import java.util.UUID;

public record NewGameMessage(UUID gameId) {
}
