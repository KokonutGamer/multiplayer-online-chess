package me.lapingcao.chess_web_socket_server.repositories;

import java.util.Queue;
import java.util.UUID;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.springframework.stereotype.Repository;

@Repository
public class InMemoryMatchmakingRepository implements MatchmakingRepository {

    /**
     * TODO document queue member
     */
    private final Queue<UUID> queue = new ConcurrentLinkedQueue<>();

    @Override
    public void enqueue(UUID userId) {
        queue.offer(userId);
    }

    @Override
    public UUID dequeue() {
        return queue.poll();
    }

    @Override
    public boolean remove(UUID userId) {
        return queue.remove(userId);
    }
}
