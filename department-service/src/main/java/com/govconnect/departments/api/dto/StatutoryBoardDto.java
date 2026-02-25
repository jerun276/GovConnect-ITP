package com.govconnect.departments.api.dto;

import java.util.UUID;

public record StatutoryBoardDto(
    UUID id,
    UUID departmentId,
    String name
) {}
