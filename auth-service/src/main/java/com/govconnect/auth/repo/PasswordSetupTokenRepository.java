package com.govconnect.auth.repo;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.govconnect.auth.domain.PasswordSetupToken;

public interface PasswordSetupTokenRepository extends JpaRepository<PasswordSetupToken, UUID> {

  Optional<PasswordSetupToken> findByToken(UUID token);
}
