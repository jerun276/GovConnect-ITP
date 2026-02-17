package com.govconnect.dev.api.dto;

import java.util.UUID;

import com.govconnect.identity.domain.AuthorityRoleLevel;

public record DevAuthorityBootstrapRequest(
    UUID userId,
    String fullName,
    String officialEmail,
    AuthorityRoleLevel officialRoleLevel,
    UUID provinceId,
    UUID districtId,
    UUID dsDivisionId,
    UUID gnDivisionId,
    boolean approve
) {}
