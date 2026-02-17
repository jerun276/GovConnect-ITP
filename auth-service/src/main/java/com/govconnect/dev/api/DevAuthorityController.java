package com.govconnect.dev.api;

import java.time.Instant;
import java.util.UUID;

import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.govconnect.auth.domain.User;
import com.govconnect.auth.domain.UserType;
import com.govconnect.auth.repo.UserRepository;
import com.govconnect.dev.api.dto.DevAuthorityBootstrapRequest;
import com.govconnect.identity.domain.AuthorityProfile;
import com.govconnect.identity.repo.AuthorityProfileRepository;

@Profile("dev")
@RestController
@RequestMapping("/api/dev/authority")
public class DevAuthorityController {

  private final UserRepository userRepository;
  private final AuthorityProfileRepository authorityProfileRepository;

  public DevAuthorityController(UserRepository userRepository,
                                AuthorityProfileRepository authorityProfileRepository) {
    this.userRepository = userRepository;
    this.authorityProfileRepository = authorityProfileRepository;
  }

  @PostMapping("/bootstrap")
  @Transactional
  public ResponseEntity<Void> bootstrap(@RequestBody DevAuthorityBootstrapRequest request) {
    if (request.userId() == null) {
      throw new IllegalArgumentException("userId is required");
    }
    if (request.fullName() == null || request.fullName().isBlank()) {
      throw new IllegalArgumentException("fullName is required");
    }
    if (request.officialEmail() == null || request.officialEmail().isBlank()) {
      throw new IllegalArgumentException("officialEmail is required");
    }
    if (request.officialRoleLevel() == null) {
      throw new IllegalArgumentException("officialRoleLevel is required");
    }

    User user = userRepository.findById(request.userId())
        .orElseThrow(() -> new IllegalArgumentException("User not found: " + request.userId()));

    user.setUserType(UserType.authority);
    userRepository.save(user);

    UUID userId = request.userId();
    AuthorityProfile profile = authorityProfileRepository.findById(userId).orElse(null);
    boolean isNew = profile == null;

    if (profile == null) {
      profile = new AuthorityProfile();
      profile.setUserId(userId);
      profile.setCreatedAt(Instant.now());
      profile.setStatus("pending");
    }

    profile.setFullName(request.fullName());
    profile.setOfficialEmail(request.officialEmail());
    profile.setOfficialRoleLevel(request.officialRoleLevel());

    profile.setProvinceId(request.provinceId());
    profile.setDistrictId(request.districtId());
    profile.setDsDivisionId(request.dsDivisionId());
    profile.setGnDivisionId(request.gnDivisionId());

    if (request.approve()) {
      profile.setStatus("approved");
      profile.setApprovedAt(Instant.now());
      profile.setApprovedByUserId(null);
    }

    if (!request.approve() && isNew) {
      profile.setStatus("pending");
    }

    authorityProfileRepository.save(profile);

    return ResponseEntity.ok().build();
  }

  @PostMapping("/users/{userId}/promote-developer-admin")
  @Transactional
  public ResponseEntity<Void> promoteDeveloperAdmin(@PathVariable UUID userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

    user.setUserType(UserType.developer_admin);
    userRepository.save(user);

    return ResponseEntity.ok().build();
  }
}
