package me.lapingcao.chess_web_socket_server.repositories;

import java.util.UUID;

/**
 * TODO document MatchmakingRepository
 */
public interface MatchmakingRepository {
    
    /**
     * TODO document enqueue method
     * 
     * @param userId
     */
    void enqueue(UUID userId);

    /**
     * TODO document dequeue method
     * 
     * @return
     */
    UUID dequeue();

    /**
     * TODO document remove method
     * 
     * @param userId
     * @return
     */
    boolean remove(UUID userId);
}
