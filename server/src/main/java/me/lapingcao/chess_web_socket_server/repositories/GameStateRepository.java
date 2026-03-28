package me.lapingcao.chess_web_socket_server.repositories;

import java.util.UUID;

import me.lapingcao.chess_web_socket_server.game.GameState;

/**
 * TODO document GameStateRepository
 */
public interface GameStateRepository {

    /**
     * TODO document save method
     * 
     * @param gameId
     * @param state
     */
    void save(UUID gameId, GameState state);

    /**
     * TODO document findById method
     * 
     * @param gameId
     * @return
     */
    GameState findById(UUID gameId);

    /**
     * TODO document delete method
     * 
     * @param gameId
     */
    void delete(UUID gameId);

    /**
     * TODO document generateNewId method
     * 
     * @return
     */
    UUID generateNewId();
}
