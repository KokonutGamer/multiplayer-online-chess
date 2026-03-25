package me.lapingcao.chess_web_socket_server.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.lapingcao.chess_web_socket_server.messages.HostRequest;

@Controller
@Slf4j
@RequiredArgsConstructor
@MessageMapping("game")
public class GameController {

    @MessageMapping("host")
    public void hostGame(@Payload HostRequest hostMessage) {
        log.info("Host request received!");
        log.info(hostMessage.toString());
    }
}
