package com.govconnect.departments.api.dto;

import java.util.UUID;

import com.govconnect.departments.domain.DepartmentType;

public record DepartmentDto(
    UUID id,
    String name,
    DepartmentType type
) {}
