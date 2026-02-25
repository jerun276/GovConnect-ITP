package com.govconnect.identity.api.dto;

import java.util.UUID;

import com.govconnect.identity.domain.AuthorityRoleLevel;

public record IdentityMeResponse(
    UUID userId,
    String userType,
    String email,
    String username,
    AuthorityRoleLevel officialRoleLevel,
    UUID provinceId,
    UUID districtId,
    UUID dsDivisionId,
    UUID gnDivisionId,
    UUID departmentId
) {}
