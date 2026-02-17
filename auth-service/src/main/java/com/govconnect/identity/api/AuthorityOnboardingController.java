package com.govconnect.identity.api;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.govconnect.common.api.BadRequestException;
import com.govconnect.common.api.ForbiddenException;
import com.govconnect.common.api.NotFoundException;
import com.govconnect.auth.domain.User;
import com.govconnect.auth.domain.UserType;
import com.govconnect.auth.repo.UserRepository;
import com.govconnect.identity.api.dto.AuthorityApplicationDto;
import com.govconnect.identity.api.dto.AuthorityApplyRequest;
import com.govconnect.identity.domain.AuthorityProfile;
import com.govconnect.identity.repo.AuthorityProfileRepository;

@RestController
@RequestMapping("/api/identity/authority")
public class AuthorityOnboardingController {

  private final AuthorityProfileRepository authorityProfileRepository;
  private final UserRepository userRepository;

  public AuthorityOnboardingController(AuthorityProfileRepository authorityProfileRepository,
                                       UserRepository userRepository) {
    this.authorityProfileRepository = authorityProfileRepository;
    this.userRepository = userRepository;
  }

  @PostMapping("/apply")
  @Transactional
  public ResponseEntity<Void> apply(@AuthenticationPrincipal Jwt jwt,
                                    @RequestBody AuthorityApplyRequest request) {
    UUID userId = UUID.fromString(jwt.getSubject());

    if (request.fullName() == null || request.fullName().isBlank()) {
      throw new BadRequestException("fullName is required");
    }
    if (request.officialEmail() == null || request.officialEmail().isBlank()) {
      throw new BadRequestException("officialEmail is required");
    }
    if (request.officialRoleLevel() == null) {
      throw new BadRequestException("officialRoleLevel is required");
    }

    AuthorityProfile profile = authorityProfileRepository.findById(userId).orElse(null);
    if (profile == null) {
      profile = new AuthorityProfile();
      profile.setUserId(userId);
      profile.setCreatedAt(Instant.now());
    }

    profile.setFullName(request.fullName());
    profile.setOfficialEmail(request.officialEmail());
    profile.setOfficialRoleLevel(request.officialRoleLevel());

    profile.setProvinceId(request.provinceId());
    profile.setDistrictId(request.districtId());
    profile.setDsDivisionId(request.dsDivisionId());
    profile.setGnDivisionId(request.gnDivisionId());

    profile.setStatus("pending");
    profile.setApprovedAt(null);
    profile.setApprovedByUserId(null);

    authorityProfileRepository.save(profile);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/applications/pending")
  public ResponseEntity<List<AuthorityApplicationDto>> listPending(@AuthenticationPrincipal Jwt jwt) {
    requireDeveloperAdmin(jwt);

    List<AuthorityApplicationDto> results = authorityProfileRepository
        .findByStatusIgnoreCaseOrderByCreatedAtDesc("pending")
        .stream()
        .map(AuthorityApplicationDto::from)
        .toList();

    return ResponseEntity.ok(results);
  }

  @PostMapping("/applications/{userId}/approve")
  @Transactional
  public ResponseEntity<Void> approve(@AuthenticationPrincipal Jwt jwt,
                                      @PathVariable UUID userId) {
    requireDeveloperAdmin(jwt);

    AuthorityProfile profile = authorityProfileRepository.findById(userId)
        .orElseThrow(() -> new NotFoundException("authority application not found"));

    profile.setStatus("approved");
    profile.setApprovedAt(Instant.now());
    profile.setApprovedByUserId(UUID.fromString(jwt.getSubject()));
    authorityProfileRepository.save(profile);

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new NotFoundException("user not found"));
    user.setUserType(UserType.authority);
    userRepository.save(user);

    return ResponseEntity.ok().build();
  }

  @PostMapping("/applications/{userId}/reject")
  @Transactional
  public ResponseEntity<Void> reject(@AuthenticationPrincipal Jwt jwt,
                                     @PathVariable UUID userId) {
    requireDeveloperAdmin(jwt);

    AuthorityProfile profile = authorityProfileRepository.findById(userId)
        .orElseThrow(() -> new NotFoundException("authority application not found"));

    profile.setStatus("rejected");
    profile.setApprovedAt(Instant.now());
    profile.setApprovedByUserId(UUID.fromString(jwt.getSubject()));
    authorityProfileRepository.save(profile);

    return ResponseEntity.ok().build();
  }

  private static void requireDeveloperAdmin(Jwt jwt) {
    String userType = jwt.getClaimAsString("userType");
    if (!"developer_admin".equalsIgnoreCase(userType)) {
      throw new ForbiddenException("not authorized");
    }
  }
}
