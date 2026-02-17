package com.govconnect.identity.api.dto;

import java.util.UUID;

import com.govconnect.identity.domain.AuthorityRoleLevel;

public record AuthorityApplyRequest(
    String fullName,
    String officialEmail,
    AuthorityRoleLevel officialRoleLevel,
    UUID provinceId,
    UUID districtId,
    UUID dsDivisionId,
    UUID gnDivisionId
) {}
