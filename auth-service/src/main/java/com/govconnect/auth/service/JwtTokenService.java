package com.govconnect.auth.service;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;

import com.govconnect.auth.domain.User;

@Service
public class JwtTokenService {

  private final JwtEncoder jwtEncoder;
  private final long expirationSeconds;

  public JwtTokenService(JwtEncoder jwtEncoder,
                         @Value("${app.jwt.expiration-seconds}") long expirationSeconds) {
    this.jwtEncoder = jwtEncoder;
    this.expirationSeconds = expirationSeconds;
  }

  public String issueToken(User user) {
    Instant now = Instant.now();
    Instant exp = now.plusSeconds(expirationSeconds);

    JwtClaimsSet claims = JwtClaimsSet.builder()
        .issuedAt(now)
        .expiresAt(exp)
        .subject(user.getId().toString())
        .claim("email", user.getEmail())
        .claim("username", user.getUsername())
        .claim("userType", user.getUserType().name())
        .build();

    JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
    return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
  }

  public long getExpirationSeconds() {
    return expirationSeconds;
  }
}
