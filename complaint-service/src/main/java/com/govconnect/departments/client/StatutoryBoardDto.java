package com.govconnect.departments.client;

import java.util.UUID;

public record StatutoryBoardDto(
    UUID id,
    UUID departmentId,
    String name
) {}
