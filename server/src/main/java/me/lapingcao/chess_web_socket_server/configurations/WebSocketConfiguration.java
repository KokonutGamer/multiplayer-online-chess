package me.lapingcao.chess_web_socket_server.configurations;

import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import me.lapingcao.chess_web_socket_server.services.JwtVerifierService;

/**
 * TODO document WebSocketConfiguration @Configuration
 */
@Configuration
@Slf4j
@EnableWebSocketMessageBroker
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {

    /**
     * TODO document messageBrokerTaskScheduler member
     */
    private final TaskScheduler messageBrokerTaskScheduler;

    /**
     * TODO document jwtVerifierService member
     */
    private final JwtVerifierService jwtVerifierService;

    public WebSocketConfiguration(@Lazy TaskScheduler taskScheduler, JwtVerifierService jwtVerifierService) {
        this.messageBrokerTaskScheduler = taskScheduler;
        this.jwtVerifierService = jwtVerifierService;
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

    /**
     * Registers a custom JWT authentication interceptor for handling
     * {@code CONNECT} commands from clients.
     * 
     * A new {@code ChannelInterceptor} anonymous class implements the
     * {@code preSend} method for intercepting messages before they're sent to
     * either the application or the message broker. The interceptor then checks for
     * a JWT within the connect headers; users that do not include a JWT will be
     * considered anonymous.
     * 
     * The interceptor relies on the {@code JwtVerifierService} to verify provided
     * access tokens. If a token cannot be verified, the application will only
     * notify to the client that a connection could not be established. If the JWT
     * is successfully verified, the {@code WebSocketSession} instance tied to this
     * connection will set the user ({@code java.security.Principal}) for the
     * session.
     * 
     * @author Gabe Lapingcao
     * @see <a href=
     *      "https://docs.spring.io/spring-framework/reference/web/websocket/stomp/authentication-token-based.html">Spring
     *      Framework | Token Authentication</a>
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                // intercept only CONNECT commands to extract a Principal
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    log.debug("Intercepting CONNECT command");

                    // retrieve the authorization header and make sure it contains a bearer token
                    String authHeader = accessor.getFirstNativeHeader("Authorization");
                    if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
                        String token = authHeader.substring(7); // extract the JWT

                        log.debug("Verifying token integretiy for {}", token);
                        // attempt to verify the token using the application's secret key
                        try {
                            Jws<Claims> signature = jwtVerifierService.verify(token);
                            Claims claims = signature.getPayload();
                            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                    claims.getSubject(), null, Collections.emptyList()); // TODO design application
                                                                                         // authorities later
                            accessor.setUser(authToken);
                        } catch (JwtException e) {
                            log.error("Failed to decrypt JWT {}", token);
                            log.error(e.getMessage());
                            throw new AccessDeniedException("Could not establish a connection with the server");
                        }
                        log.debug("Successfully decrypted JWT {}");
                    }
                }
                log.debug("Sending message to clientInboundChannel");
                return message;
            }
        });
    }

    /**
     * Disables Spring Security's default CSRF protection for WebSockets. The bean
     * name "csrfChannelInterceptor" is strictly required for Spring to recognize
     * it.
     * 
     * @return an empty {@code ChannelInterceptor} anonymous class
     */
    @Bean("csrfChannelInterceptor")
    public ChannelInterceptor csrfChannelInterceptor() {
        return new ChannelInterceptor() {
        };
    }
}
