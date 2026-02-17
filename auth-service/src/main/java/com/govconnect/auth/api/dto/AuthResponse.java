package com.govconnect.auth.api.dto;

public record AuthResponse(
    String accessToken,
    long expiresInSeconds
) {}
