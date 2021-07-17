package com.iwaodev.util;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtUtil {

  @Value("${jwt.secret}")
  private String jwtSecret;

  @Value("${jwt.expiration}")
  private Integer jwtExpiration;

  public String extractUserId(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  public Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parser().setSigningKey(this.jwtSecret).parseClaimsJws(token).getBody();
  }

  private Boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  public String generateToken(UserDetails userDetails) {
    Map<String, Object> claims = new HashMap<>();
    // use getUsername to retrieve the email address of the user
    return createToken(claims, userDetails.getUsername());
  }

  public String generateToken(String userId) {
    Map<String, Object> claims = new HashMap<>();
    // use getUsername to retrieve the userId of the user
    return createToken(claims, userId);
  }

  private String createToken(Map<String, Object> claims, String subject) {
    return Jwts.builder()
      .setClaims(claims)
      .setSubject(subject)
      .setIssuedAt(new Date(System.currentTimeMillis()))
      .setExpiration(new Date(System.currentTimeMillis() + this.jwtExpiration))
      .signWith(SignatureAlgorithm.HS256, this.jwtSecret).compact();

  }

  public Boolean validateToken(String token, String userId) {
    final String userIdFromToken = extractUserId(token);
    // uerDetails.getUsername return userId (UUID.toString())
    return (userId.equals(userIdFromToken) && !isTokenExpired(token));

  }
}
