package me.lapingcao.chess_web_socket_server.configurations;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {

    private final TaskScheduler messageBrokerTaskScheduler;

    public WebSocketConfiguration(@Lazy TaskScheduler taskScheduler) {
        this.messageBrokerTaskScheduler = taskScheduler;
    }

    /**
     * Configures the WebSocket MessageBrokerRegistry.
     * 
     * The registry enables the {@code "/topic"} endpoint that allows broadcast, or
     * publishing and subscribing, while {@code "/queue"} enables private messaging
     * between users.
     * 
     * @author Gabe Lapingcao
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue")
                .setHeartbeatValue(new long[] { 20000, 20000 })
                .setTaskScheduler(this.messageBrokerTaskScheduler);
        config.setApplicationDestinationPrefixes("/app");
    }

    /**
     * Registers the WebSocket endpoint for WebSocket client connections to
     * {@code "/ws"}, allowing for the WebSocket handshake.
     * 
     * In the WebSocket handshake, the client initiates a request by contacting the
     * server and requesting a WebSocket connection. This initial request uses the
     * HTTP 1.1 protocol which <strong>must</strong> be a {@code GET} request and
     * <strong>must</strong> include upgrade headers ({@code Upgrade: websocket}
     * and {@code Connection: Upgrade}).
     * 
     * After receiving the WebSocket upgrade request, the server shall send a
     * response indicating change from HTTP to WebSocket (such as
     * {@code HTTP/1.1 101 Switching Protocols}).
     * 
     * 
     * @author Gabe Lapingcao
     * @see <a href=
     *      "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers">MDN
     *      | Writing WebSocket servers</a>
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOriginPatterns("http://*localhost:[*]");
        registry.addEndpoint("/ws").setAllowedOriginPatterns("http://*localhost:[*]").withSockJS();
    }
}
