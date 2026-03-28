package me.lapingcao.chess_web_socket_server.services;

import java.util.UUID;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.lapingcao.chess_web_socket_server.exceptions.GameNotFoundException;
import me.lapingcao.chess_web_socket_server.game.GameState;
import me.lapingcao.chess_web_socket_server.repositories.GameStateRepository;

@Service
@Slf4j
@RequiredArgsConstructor
public class MatchmakingService {

    private final GameStateRepository gameStateRepository;

    public UUID hostGame(UUID userId) {
        // TODO extend this method to check if a user is banned

        // find an available gameId for this new game
        return gameStateRepository.generateNewId();
    }

    public void joinGame(UUID gameId, UUID userId) {
        // TODO extend this method to check if a user is banned

        GameState game = gameStateRepository.findById(gameId);

        if(game == null) {
            throw new GameNotFoundException(gameId);
        }

        // TODO check if allowed access to this game
        // TODO check if the game is full or in progress
    }
}
