package com.govconnect.complaints.api.dto;

import java.time.Instant;
import java.util.UUID;

import com.govconnect.complaints.domain.ComplaintStatus;
import com.govconnect.complaints.domain.TargetType;

public record ComplaintDto(
    UUID id,
    String complaintCode,
    UUID submittedByUserId,
    String categoryCode,
    String descriptionText,
    TargetType targetType,
    UUID selectedDepartmentId,
    UUID incidentProvinceId,
    UUID incidentDistrictId,
    UUID incidentDsDivisionId,
    UUID incidentGnDivisionId,
    ComplaintStatus status,
    Instant createdAt,
    Instant updatedAt
) {}
