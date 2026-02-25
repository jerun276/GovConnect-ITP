package com.govconnect.complaints.api.dto;

import java.util.UUID;

import com.govconnect.complaints.domain.TargetType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateComplaintRequest(
    @NotBlank String categoryCode,
    @NotBlank String descriptionText,
    @NotNull TargetType targetType,
    UUID selectedDepartmentId,
    UUID selectedStatutoryBoardId,
    UUID incidentProvinceId,
    UUID incidentDistrictId,
    UUID incidentDsDivisionId,
    UUID incidentGnDivisionId
) {}
