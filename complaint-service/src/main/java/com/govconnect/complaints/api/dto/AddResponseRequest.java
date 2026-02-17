package com.govconnect.complaints.api.dto;

import jakarta.validation.constraints.NotBlank;

public record AddResponseRequest(
    @NotBlank String message
) {}
