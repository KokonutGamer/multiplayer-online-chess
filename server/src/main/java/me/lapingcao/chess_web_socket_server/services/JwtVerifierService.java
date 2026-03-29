package me.lapingcao.chess_web_socket_server.services;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

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
     * TODO document secretKey member
     */
    private final SecretKey secretKey;

    public JwtVerifierService(@Value("${postgres.jwt.secret}") String jwtSecret) {
        // create a new secret key using the database's JWT secret bytes (encoded in
        // UTF_8)
        this.secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * TODO document verify method
     * 
     * @param jwt
     * @return
     * @throws JwtException
     */
    public Jws<Claims> verify(String jwt) throws JwtException {
        // verify the JWT and expand the signed claims
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(jwt);
    }

    /**
     * TODO document signUser method
     * 
     * @param userId
     * @return
     */
    public String signUser(UUID userId) {
        // sign a new JWT with the supplied userId as the subject
        return Jwts.builder().subject(userId.toString()).signWith(secretKey).compact();
    }
}
