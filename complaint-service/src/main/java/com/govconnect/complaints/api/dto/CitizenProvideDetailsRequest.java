package com.govconnect.complaints.api.dto;

import jakarta.validation.constraints.NotBlank;

public record CitizenProvideDetailsRequest(
    @NotBlank String message
) {}
