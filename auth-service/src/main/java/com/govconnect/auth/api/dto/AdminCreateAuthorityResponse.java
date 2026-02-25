package com.govconnect.auth.api.dto;

import java.time.Instant;
import java.util.UUID;

public record AdminCreateAuthorityResponse(
    UUID userId,
    UUID passwordSetupToken,
    Instant expiresAt
) {}
