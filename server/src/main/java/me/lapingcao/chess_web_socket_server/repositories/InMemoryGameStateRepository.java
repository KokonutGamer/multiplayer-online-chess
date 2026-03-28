package me.lapingcao.chess_web_socket_server.repositories;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Repository;

import me.lapingcao.chess_web_socket_server.game.GameState;

@Repository
public class InMemoryGameStateRepository implements GameStateRepository {

    /**
     * TODO document store member
     */
    private final Map<UUID, GameState> store = new ConcurrentHashMap<>();

    @Override
    public void save(UUID gameId, GameState state) {
        store.put(gameId, state);
    }

    @Override
    public GameState findById(UUID gameId) {
        return store.get(gameId);
    }

    @Override
    public void delete(UUID gameId) {
        store.remove(gameId);
    }

    @Override
    public UUID generateNewId() {
        UUID gameId = UUID.randomUUID();

        GameState initialState;
        do {
            // atomic compare and swap to 
            initialState = store.putIfAbsent(gameId, null);
        } while (initialState != null);

        return gameId;
    }
}
