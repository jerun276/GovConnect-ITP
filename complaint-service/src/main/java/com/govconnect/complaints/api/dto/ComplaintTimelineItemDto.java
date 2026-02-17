package com.govconnect.complaints.api.dto;

import java.time.Instant;
import java.util.UUID;

public record ComplaintTimelineItemDto(
    String type,
    Instant createdAt,
    UUID actorUserId,
    String message,
    String fromStatus,
    String toStatus,
    UUID assignedToUserId
) {}
