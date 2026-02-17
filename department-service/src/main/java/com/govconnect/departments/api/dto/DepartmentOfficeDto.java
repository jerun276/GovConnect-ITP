package com.govconnect.departments.api.dto;

import java.util.UUID;

public record DepartmentOfficeDto(
    UUID id,
    UUID departmentId,
    UUID districtId,
    String officeName,
    String address,
    boolean isHeadOffice
) {}
