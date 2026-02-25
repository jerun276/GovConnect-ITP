package com.govconnect.auth.api.dto;

import java.util.UUID;

import com.govconnect.identity.domain.AuthorityRoleLevel;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AdminCreateAuthorityRequest(
    @NotBlank String fullName,
    @Email @NotBlank String officialEmail,
    @NotNull AuthorityRoleLevel officialRoleLevel,
    UUID provinceId,
    UUID districtId,
    UUID dsDivisionId,
    UUID gnDivisionId,
    UUID departmentId
) {}
