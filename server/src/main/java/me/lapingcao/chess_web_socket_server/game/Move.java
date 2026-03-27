package me.lapingcao.chess_web_socket_server.game;

import java.util.Set;

/**
 * TODO document Move record
 */
public record Move(String from, String to, Character promotedTo) {

    /**
     * TODO document VALID_PROMOTIONS object
     */
    private static final Set<Character> VALID_PROMOTIONS = Set.of('q', 'r', 'b', 'n');

    /**
     * TODO document isValidSquare static method
     * 
     * @param square
     * @return
     */
    private static boolean isValidSquare(String square) {
        if (square == null || square.length() != 2) {
            return false;
        }

        char file = Character.toLowerCase(square.charAt(0));
        char rank = square.charAt(1);

        return file >= 'a' && file <= 'h' && rank >= '1' && rank <= '8';
    }

    /**
     * TODO document Move compact constructor
     * 
     * @param from
     * @param to
     * @param promotedTo
     */
    public Move {
        if (from == null || to == null) {
            throw new IllegalArgumentException("Missing source square and/or destination square");
        }

        if (!isValidSquare(from) || !isValidSquare(to)) {
            throw new IllegalArgumentException(String.format("Invalid board squares: %s, %s", from, to));
        }

        if (promotedTo != null && !VALID_PROMOTIONS.contains(promotedTo)) {
            throw new IllegalArgumentException(String.format("Invalid promotion piece: %s", promotedTo));
        }
    }
}
