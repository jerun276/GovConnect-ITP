package com.govconnect.auth.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.govconnect.auth.api.dto.AuthResponse;
import com.govconnect.auth.api.dto.LoginRequest;
import com.govconnect.auth.api.dto.RegisterRequest;
import com.govconnect.auth.domain.User;
import com.govconnect.auth.domain.UserType;
import com.govconnect.auth.repo.UserRepository;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtTokenService jwtTokenService;

  public AuthService(UserRepository userRepository,
                     PasswordEncoder passwordEncoder,
                     JwtTokenService jwtTokenService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtTokenService = jwtTokenService;
  }

  @Transactional
  public AuthResponse registerCitizen(RegisterRequest request) {
    if (userRepository.existsByUsernameIgnoreCase(request.username())) {
      throw new IllegalArgumentException("username already exists");
    }
    if (userRepository.existsByEmailIgnoreCase(request.email())) {
      throw new IllegalArgumentException("email already exists");
    }

    Instant now = Instant.now();

    User user = new User();
    user.setId(UUID.randomUUID());
    user.setUserType(UserType.citizen);
    user.setUsername(request.username());
    user.setEmail(request.email());
    user.setPasswordHash(passwordEncoder.encode(request.password()));
    user.setBanned(false);
    user.setCreatedAt(now);
    user.setUpdatedAt(now);

    userRepository.save(user);

    String token = jwtTokenService.issueToken(user);
    return new AuthResponse(token, jwtTokenService.getExpirationSeconds());
  }

  @Transactional(readOnly = true)
  public AuthResponse login(LoginRequest request) {
    Optional<User> userOpt = request.identifier().contains("@")
        ? userRepository.findByEmailIgnoreCase(request.identifier())
        : userRepository.findByUsernameIgnoreCase(request.identifier());

    User user = userOpt.orElseThrow(() -> new IllegalArgumentException("invalid credentials"));

    if (user.isBanned()) {
      throw new IllegalArgumentException("account banned");
    }

    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw new IllegalArgumentException("invalid credentials");
    }

    String token = jwtTokenService.issueToken(user);
    return new AuthResponse(token, jwtTokenService.getExpirationSeconds());
  }
}
