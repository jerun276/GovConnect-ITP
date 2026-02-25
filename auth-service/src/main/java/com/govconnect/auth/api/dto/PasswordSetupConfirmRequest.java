package com.govconnect.auth.api.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PasswordSetupConfirmRequest(
    @NotNull UUID token,
    @NotBlank String newPassword
) {}
