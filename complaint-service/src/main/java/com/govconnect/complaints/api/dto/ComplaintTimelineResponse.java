package com.govconnect.complaints.api.dto;

import java.util.List;

public record ComplaintTimelineResponse(
    ComplaintDto complaint,
    List<ComplaintTimelineItemDto> timeline
) {}
