package com.govconnect.identity.client;

import java.util.UUID;

public record IdentityMeResponse(
    UUID userId,
    String userType,
    String email,
    String username,
    String officialRoleLevel,
    UUID provinceId,
    UUID districtId,
    UUID dsDivisionId,
    UUID gnDivisionId
) {}
