package com.govconnect.identity.repo;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.govconnect.identity.domain.AuthorityProfile;

public interface AuthorityProfileRepository extends JpaRepository<AuthorityProfile, UUID> {

  List<AuthorityProfile> findByStatusIgnoreCaseOrderByCreatedAtDesc(String status);
}
