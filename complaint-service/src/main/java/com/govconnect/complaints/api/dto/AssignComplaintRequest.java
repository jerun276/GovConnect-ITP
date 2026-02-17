package com.govconnect.complaints.api.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record AssignComplaintRequest(
    @NotNull UUID assignedToUserId,
    String reason
) {}
