package com.govconnect.identity.api.dto;

import java.time.Instant;
import java.util.UUID;

import com.govconnect.identity.domain.AuthorityProfile;
import com.govconnect.identity.domain.AuthorityRoleLevel;

public record AuthorityApplicationDto(
    UUID userId,
    String fullName,
    String officialEmail,
    AuthorityRoleLevel officialRoleLevel,
    UUID provinceId,
    UUID districtId,
    UUID dsDivisionId,
    UUID gnDivisionId,
    String status,
    Instant createdAt
) {

  public static AuthorityApplicationDto from(AuthorityProfile profile) {
    return new AuthorityApplicationDto(
        profile.getUserId(),
        profile.getFullName(),
        profile.getOfficialEmail(),
        profile.getOfficialRoleLevel(),
        profile.getProvinceId(),
        profile.getDistrictId(),
        profile.getDsDivisionId(),
        profile.getGnDivisionId(),
        profile.getStatus(),
        profile.getCreatedAt()
    );
  }
}
