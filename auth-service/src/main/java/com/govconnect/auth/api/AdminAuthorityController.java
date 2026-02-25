package com.govconnect.auth.api;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.govconnect.auth.api.dto.AdminCreateAuthorityRequest;
import com.govconnect.auth.api.dto.AdminCreateAuthorityResponse;
import com.govconnect.auth.api.dto.AuthResponse;
import com.govconnect.auth.api.dto.PasswordSetupConfirmRequest;
import com.govconnect.auth.domain.PasswordSetupToken;
import com.govconnect.auth.domain.User;
import com.govconnect.auth.domain.UserType;
import com.govconnect.auth.repo.PasswordSetupTokenRepository;
import com.govconnect.auth.repo.UserRepository;
import com.govconnect.auth.service.JwtTokenService;
import com.govconnect.common.api.BadRequestException;
import com.govconnect.common.api.ForbiddenException;
import com.govconnect.common.api.NotFoundException;
import com.govconnect.identity.domain.AuthorityProfile;
import com.govconnect.identity.domain.AuthorityRoleLevel;
import com.govconnect.identity.repo.AuthorityProfileRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/authorities")
@Validated
public class AdminAuthorityController {

  private final UserRepository userRepository;
  private final AuthorityProfileRepository authorityProfileRepository;
  private final PasswordSetupTokenRepository passwordSetupTokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtTokenService jwtTokenService;

  public AdminAuthorityController(UserRepository userRepository,
                                 AuthorityProfileRepository authorityProfileRepository,
                                 PasswordSetupTokenRepository passwordSetupTokenRepository,
                                 PasswordEncoder passwordEncoder,
                                 JwtTokenService jwtTokenService) {
    this.userRepository = userRepository;
    this.authorityProfileRepository = authorityProfileRepository;
    this.passwordSetupTokenRepository = passwordSetupTokenRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtTokenService = jwtTokenService;
  }

  @PostMapping
  @Transactional
  public ResponseEntity<AdminCreateAuthorityResponse> create(@AuthenticationPrincipal Jwt jwt,
                                                            @Valid @RequestBody AdminCreateAuthorityRequest request) {
    requireDeveloperAdmin(jwt);

    validateJurisdiction(request.officialRoleLevel(), request.provinceId(), request.districtId(), request.dsDivisionId(), request.gnDivisionId(), request.departmentId());

    if (userRepository.existsByEmailIgnoreCase(request.officialEmail())) {
      throw new BadRequestException("email already exists");
    }

    Instant now = Instant.now();

    User user = new User();
    user.setId(UUID.randomUUID());
    user.setUserType(UserType.authority);
    user.setUsername(request.officialEmail());
    user.setEmail(request.officialEmail());
    user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
    user.setPasswordSet(false);
    user.setBanned(false);
    user.setCreatedAt(now);
    user.setUpdatedAt(now);
    userRepository.save(user);

    AuthorityProfile profile = new AuthorityProfile();
    profile.setUserId(user.getId());
    profile.setFullName(request.fullName());
    profile.setOfficialEmail(request.officialEmail());
    profile.setOfficialRoleLevel(request.officialRoleLevel());
    profile.setProvinceId(request.provinceId());
    profile.setDistrictId(request.districtId());
    profile.setDsDivisionId(request.dsDivisionId());
    profile.setGnDivisionId(request.gnDivisionId());
    profile.setDepartmentId(request.departmentId());
    profile.setStatus("approved");
    profile.setApprovedAt(now);
    profile.setApprovedByUserId(UUID.fromString(jwt.getSubject()));
    profile.setCreatedAt(now);
    authorityProfileRepository.save(profile);

    PasswordSetupToken token = createPasswordSetupToken(user.getId(), now);

    return ResponseEntity.ok(new AdminCreateAuthorityResponse(user.getId(), token.getToken(), token.getExpiresAt()));
  }

  @PostMapping("/{userId}/password-setup-token")
  @Transactional
  public ResponseEntity<AdminCreateAuthorityResponse> createPasswordSetupToken(@AuthenticationPrincipal Jwt jwt,
                                                                              @PathVariable UUID userId) {
    requireDeveloperAdmin(jwt);

    if (userId == null) {
      throw new BadRequestException("userId is required");
    }

    UUID safeUserId = Objects.requireNonNull(userId);

    User user = userRepository.findById(safeUserId)
        .orElseThrow(() -> new NotFoundException("user not found"));

    Instant now = Instant.now();
    PasswordSetupToken token = createPasswordSetupToken(user.getId(), now);

    return ResponseEntity.ok(new AdminCreateAuthorityResponse(user.getId(), token.getToken(), token.getExpiresAt()));
  }

  @PostMapping("/password-setup/confirm")
  @Transactional
  public ResponseEntity<AuthResponse> confirmPasswordSetup(@Valid @RequestBody PasswordSetupConfirmRequest request) {
    if (request.token() == null) {
      throw new BadRequestException("token is required");
    }

    PasswordSetupToken token = passwordSetupTokenRepository.findByToken(request.token())
        .orElseThrow(() -> new NotFoundException("token not found"));

    Instant now = Instant.now();

    if (token.getUsedAt() != null) {
      throw new BadRequestException("token already used");
    }
    if (token.getExpiresAt() == null || now.isAfter(token.getExpiresAt())) {
      throw new BadRequestException("token expired");
    }

    if (token.getUserId() == null) {
      throw new BadRequestException("token is invalid");
    }

    UUID safeTokenUserId = Objects.requireNonNull(token.getUserId());

    User user = userRepository.findById(safeTokenUserId)
        .orElseThrow(() -> new NotFoundException("user not found"));

    user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
    user.setPasswordSet(true);
    user.setUpdatedAt(now);
    userRepository.save(user);

    token.setUsedAt(now);
    passwordSetupTokenRepository.save(token);

    String jwt = jwtTokenService.issueToken(user);
    return ResponseEntity.ok(new AuthResponse(jwt, jwtTokenService.getExpirationSeconds()));
  }

  private PasswordSetupToken createPasswordSetupToken(UUID userId, Instant now) {
    PasswordSetupToken token = new PasswordSetupToken();
    token.setToken(UUID.randomUUID());
    token.setUserId(userId);
    token.setCreatedAt(now);
    token.setExpiresAt(now.plusSeconds(60L * 60L * 24L));
    token.setUsedAt(null);
    passwordSetupTokenRepository.save(token);
    return token;
  }

  private static void requireDeveloperAdmin(Jwt jwt) {
    String userType = jwt.getClaimAsString("userType");
    if (!"developer_admin".equalsIgnoreCase(userType)) {
      throw new ForbiddenException("not authorized");
    }
  }

  private static void validateJurisdiction(AuthorityRoleLevel level,
                                          UUID provinceId,
                                          UUID districtId,
                                          UUID dsDivisionId,
                                          UUID gnDivisionId,
                                          UUID departmentId) {
    if (level == null) {
      throw new BadRequestException("officialRoleLevel is required");
    }

    switch (level) {
      case CENTRAL -> {
      }
      case PROVINCIAL -> {
        if (provinceId == null) throw new BadRequestException("provinceId is required for PROVINCIAL");
      }
      case DSD -> {
        if (districtId == null) throw new BadRequestException("districtId is required for DSD");
      }
      case DS -> {
        if (dsDivisionId == null) throw new BadRequestException("dsDivisionId is required for DS");
      }
      case GS -> {
        if (gnDivisionId == null) throw new BadRequestException("gnDivisionId is required for GS");
      }
      case DEPT_HEAD -> {
        if (departmentId == null) throw new BadRequestException("departmentId is required for DEPT_HEAD");
      }
    }
  }
}
