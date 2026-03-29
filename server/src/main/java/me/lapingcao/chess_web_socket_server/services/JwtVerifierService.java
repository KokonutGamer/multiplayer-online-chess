package me.lapingcao.chess_web_socket_server.services;

import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

/**
 * TODO document JwtVerifierService @Service
 */
@Service
public class JwtVerifierService {

    /**
     * TODO document jwtSecret member
     */
    @Value("${postgres.jwt.secret}")
    private String jwtSecret;

    /**
     * TODO document verify method
     * 
     * @param jwt
     * @return
     * @throws JwtException
     */
    public Jws<Claims> verify(String jwt) throws JwtException {
        // create a new secret key using the database's JWT secret bytes (encoded in UTF_8)
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

        // verify the JWT and expand the signed claims
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(jwt);
    }
}
