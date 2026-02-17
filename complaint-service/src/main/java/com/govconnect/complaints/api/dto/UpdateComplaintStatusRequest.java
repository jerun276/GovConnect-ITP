package com.govconnect.complaints.api.dto;

import com.govconnect.complaints.domain.ComplaintStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateComplaintStatusRequest(
    @NotNull ComplaintStatus toStatus,
    String note
) {}
