package me.lapingcao.chess_web_socket_server.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;
import org.springframework.security.messaging.access.intercept.MessageMatcherDelegatingAuthorizationManager;

/**
 * TODO document WebSocketSecurityConfiguration @Configuration
 */
@Configuration
@EnableWebSocketSecurity
public class WebSocketSecurityConfiguration {

    /**
     * TODO document messageAuthorizationManager method
     * 
     * @param messages
     * @return
     */
    @Bean
    public AuthorizationManager<Message<?>> messageAuthorizationManager(
            MessageMatcherDelegatingAuthorizationManager.Builder messages) {
        messages
                .nullDestMatcher().permitAll()
                .simpSubscribeDestMatchers("/user/queue/errors").permitAll()
                .simpDestMatchers("/app/**").authenticated()
                .simpSubscribeDestMatchers("/user/**").authenticated()
                .anyMessage().denyAll();
        return messages.build();
    }
}
