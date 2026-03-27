package me.lapingcao.chess_web_socket_server.messages;

// https://docs.oracle.com/en/java/javase/17/language/records.html

import java.util.UUID;

import me.lapingcao.chess_web_socket_server.game.Move;

public record MoveRequest(UUID userId, Move move) {
}
