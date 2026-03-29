package me.lapingcao.chess_web_socket_server.configurations;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.lapingcao.chess_web_socket_server.services.JwtVerifierService;

/**
 * TODO document WebSocketJwtConfiguration @Configuration
 */
@Configuration
@Slf4j
@RequiredArgsConstructor
@EnableWebSocketMessageBroker
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class WebSocketJwtConfiguration implements WebSocketMessageBrokerConfigurer {

    /**
     * TODO document jwtVerifierService member
     */
    private final JwtVerifierService jwtVerifierService;

    /**
     * Registers a custom JWT authentication interceptor for 
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                // intercept only CONNECT commands to extract a Principal
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    
                    // retrieve the authorization header and make sure it contains a bearer token
                    String authHeader = accessor.getFirstNativeHeader("Authorization");
                    if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
                        String token = authHeader.substring(7); // extract the JWT
                        
                        // attempt to verify the token using the application's secret key
                        try {
                            Jws<Claims> signature = jwtVerifierService.verify(token);
                            Claims claims = signature.getPayload();
                            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                    claims, null);
                            accessor.setUser(authToken);
                        } catch (JwtException e) {
                            log.error("Failed to decrypt JWT {}", token);
                            log.error(e.getMessage());
                            throw new AccessDeniedException("Could not establish a connection with the server");
                        }
                    }
                }
                return message;
            }
        });
    }
}
