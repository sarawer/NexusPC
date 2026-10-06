package com.nexuspc.auth;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
@Service public class JwtService{
 private final SecretKey key; private final long expirationMs;
 public JwtService(@Value("${security.jwt.secret:}") String secret,@Value("${security.jwt.expiration-ms:86400000}") long expirationMs){
  if(secret==null||secret.length()<32)throw new IllegalStateException("JWT_SECRET must be set and contain at least 32 characters");
  key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));this.expirationMs=expirationMs;
 }
 public String generateToken(UserDetails u){Instant now=Instant.now();return Jwts.builder().subject(u.getUsername()).issuedAt(Date.from(now)).expiration(new Date(now.toEpochMilli()+expirationMs)).signWith(key).compact();}
 public String extractUsername(String token){return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();}
 public boolean isValid(String token,UserDetails u){try{return extractUsername(token).equalsIgnoreCase(u.getUsername());}catch(JwtException|IllegalArgumentException e){return false;}}
}
