package com.govconnect.identity.api;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.govconnect.identity.api.dto.IdentityMeResponse;
import com.govconnect.identity.domain.AuthorityProfile;
import com.govconnect.identity.repo.AuthorityProfileRepository;

@RestController
@RequestMapping("/api/identity")
public class IdentityController {

  private final AuthorityProfileRepository authorityProfileRepository;

  public IdentityController(AuthorityProfileRepository authorityProfileRepository) {
    this.authorityProfileRepository = authorityProfileRepository;
  }

  @GetMapping("/me")
  public ResponseEntity<IdentityMeResponse> me(@AuthenticationPrincipal Jwt jwt) {
    UUID userId = UUID.fromString(jwt.getSubject());

    String userType = jwt.getClaimAsString("userType");
    String email = jwt.getClaimAsString("email");
    String username = jwt.getClaimAsString("username");

    AuthorityProfile profile = authorityProfileRepository.findById(userId).orElse(null);

    return ResponseEntity.ok(new IdentityMeResponse(
        userId,
        userType,
        email,
        username,
        profile == null ? null : profile.getOfficialRoleLevel(),
        profile == null ? null : profile.getProvinceId(),
        profile == null ? null : profile.getDistrictId(),
        profile == null ? null : profile.getDsDivisionId(),
        profile == null ? null : profile.getGnDivisionId(),
        profile == null ? null : profile.getDepartmentId()
    ));
  }
}
