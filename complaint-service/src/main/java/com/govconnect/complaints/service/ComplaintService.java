package com.govconnect.complaints.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.govconnect.common.api.BadRequestException;
import com.govconnect.common.api.ForbiddenException;
import com.govconnect.common.api.NotFoundException;
import com.govconnect.complaints.api.dto.ComplaintDto;
import com.govconnect.complaints.api.dto.ComplaintTimelineItemDto;
import com.govconnect.complaints.api.dto.ComplaintTimelineResponse;
import com.govconnect.complaints.api.dto.CreateComplaintRequest;
import com.govconnect.complaints.domain.Complaint;
import com.govconnect.complaints.domain.ComplaintAssignment;
import com.govconnect.complaints.domain.ComplaintInternalNote;
import com.govconnect.complaints.domain.ComplaintResponse;
import com.govconnect.complaints.domain.ComplaintResponseType;
import com.govconnect.complaints.domain.ComplaintStatus;
import com.govconnect.complaints.domain.ComplaintStatusHistory;
import com.govconnect.complaints.domain.TargetType;
import com.govconnect.complaints.repo.ComplaintAssignmentRepository;
import com.govconnect.complaints.repo.ComplaintInternalNoteRepository;
import com.govconnect.complaints.repo.ComplaintRepository;
import com.govconnect.complaints.repo.ComplaintResponseRepository;
import com.govconnect.complaints.repo.ComplaintStatusHistoryRepository;
import com.govconnect.departments.client.DepartmentServiceClient;
import com.govconnect.departments.client.StatutoryBoardDto;
import com.govconnect.identity.client.IdentityMeResponse;

import org.springframework.web.client.RestClientResponseException;

@Service
public class ComplaintService {

  private final ComplaintRepository complaintRepository;
  private final ComplaintCodeService complaintCodeService;
  private final ComplaintStatusHistoryRepository statusHistoryRepository;
  private final ComplaintAssignmentRepository assignmentRepository;
  private final ComplaintInternalNoteRepository internalNoteRepository;
  private final ComplaintResponseRepository responseRepository;
  private final DepartmentServiceClient departmentServiceClient;

  public ComplaintService(ComplaintRepository complaintRepository,
      ComplaintCodeService complaintCodeService,
      ComplaintStatusHistoryRepository statusHistoryRepository,
      ComplaintAssignmentRepository assignmentRepository,
      ComplaintInternalNoteRepository internalNoteRepository,
      ComplaintResponseRepository responseRepository,
      DepartmentServiceClient departmentServiceClient) {
    this.complaintRepository = complaintRepository;
    this.complaintCodeService = complaintCodeService;
    this.statusHistoryRepository = statusHistoryRepository;
    this.assignmentRepository = assignmentRepository;
    this.internalNoteRepository = internalNoteRepository;
    this.responseRepository = responseRepository;
    this.departmentServiceClient = departmentServiceClient;
  }

  @Transactional
  public ComplaintDto create(UUID submittedByUserId, CreateComplaintRequest request, String authorizationHeader) {
    Instant now = Instant.now();

    if (request.incidentProvinceId() == null) {
      throw new BadRequestException("incidentProvinceId must not be null");
    }
    if (request.incidentDistrictId() == null) {
      throw new BadRequestException("incidentDistrictId must not be null");
    }
    if (request.incidentDsDivisionId() == null) {
      throw new BadRequestException("incidentDsDivisionId must not be null");
    }

    String complaintCode;
    do {
      complaintCode = complaintCodeService.generate();
    } while (complaintRepository.existsByComplaintCode(complaintCode));

    Complaint c = new Complaint();
    c.setId(UUID.randomUUID());
    c.setComplaintCode(complaintCode);
    c.setSubmittedByUserId(submittedByUserId);
    c.setCategoryCode(request.categoryCode());
    c.setDescriptionText(request.descriptionText());
    c.setTargetType(request.targetType());

    if (request.targetType() == TargetType.department) {
      c.setSelectedDepartmentId(request.selectedDepartmentId());
      c.setSelectedStatutoryBoardId(null);
    } else if (request.targetType() == TargetType.statutory_board) {
      if (request.selectedStatutoryBoardId() == null) {
        throw new BadRequestException("selectedStatutoryBoardId is required");
      }
      StatutoryBoardDto board;
      try {
        board = departmentServiceClient.getStatutoryBoard(request.selectedStatutoryBoardId(), authorizationHeader);
      } catch (RestClientResponseException ex) {
        if (ex.getRawStatusCode() == 404) {
          throw new NotFoundException("statutory board not found");
        }
        if (ex.getRawStatusCode() == 401 || ex.getRawStatusCode() == 403) {
          throw new ForbiddenException("not authorized to resolve statutory board");
        }
        throw new BadRequestException("failed to resolve statutory board");
      }
      if (board == null || board.departmentId() == null) {
        throw new BadRequestException("statutory board not found");
      }
      c.setSelectedStatutoryBoardId(board.id());
      c.setSelectedDepartmentId(board.departmentId());
    } else {
      c.setSelectedDepartmentId(null);
      c.setSelectedStatutoryBoardId(null);
    }

    c.setIncidentProvinceId(request.incidentProvinceId());
    c.setIncidentDistrictId(request.incidentDistrictId());
    c.setIncidentDsDivisionId(request.incidentDsDivisionId());
    c.setIncidentGnDivisionId(request.incidentGnDivisionId());
    c.setStatus(ComplaintStatus.submitted);
    c.setRejected(false);
    c.setCreatedAt(now);
    c.setUpdatedAt(now);

    complaintRepository.save(c);

    createStatusHistory(c.getId(), null, c.getStatus().name(), submittedByUserId, null, now);

    return toDto(c);
  }

  @Transactional(readOnly = true)
  public List<ComplaintDto> myComplaints(UUID userId) {
    return complaintRepository.findBySubmittedByUserIdOrderByCreatedAtDesc(userId)
        .stream()
        .map(this::toDto)
        .toList();
  }

  @Transactional(readOnly = true)
  public ComplaintDto get(UUID complaintId) {
    Complaint c = complaintRepository.findById(complaintId)
        .orElseThrow(() -> new NotFoundException("complaint not found"));
    return toDto(c);
  }

  @Transactional(readOnly = true)
  public ComplaintDto getForActor(com.govconnect.identity.client.IdentityMeResponse identity,
                                 UUID actorUserId,
                                 String actorUserType,
                                 UUID complaintId) {
    Complaint c = complaintRepository.findById(complaintId)
        .orElseThrow(() -> new NotFoundException("complaint not found"));

    if (actorUserType == null) {
      throw new ForbiddenException("not authorized");
    }

    if ("citizen".equalsIgnoreCase(actorUserType)) {
      if (actorUserId == null || !actorUserId.equals(c.getSubmittedByUserId())) {
        throw new ForbiddenException("not authorized");
      }
      return toDto(c);
    }

    requireAuthority(identity);
    ensureCanViewInQueue(identity, c);
    return toDto(c);
  }

  @Transactional(readOnly = true)
  public List<ComplaintDto> queue(IdentityMeResponse identity) {
    if (identity == null || identity.userType() == null) {
      throw new BadRequestException("identity not available");
    }

    if (!"authority".equalsIgnoreCase(identity.userType())
        && !"developer_admin".equalsIgnoreCase(identity.userType())) {
      throw new ForbiddenException("not authorized");
    }

    String level = identity.officialRoleLevel();
    if (level == null) {
      throw new ForbiddenException("authority profile not found");
    }

    List<Complaint> complaints;
    switch (level) {
      case "CENTRAL" -> complaints = complaintRepository.findAll();
      case "PROVINCIAL" -> {
        if (identity.provinceId() == null)
          throw new BadRequestException("province scope missing");
        complaints = complaintRepository.findByIncidentProvinceIdOrderByCreatedAtDesc(identity.provinceId());
      }
      case "DSD" -> {
        if (identity.districtId() == null)
          throw new BadRequestException("district scope missing");
        complaints = complaintRepository.findByIncidentDistrictIdOrderByCreatedAtDesc(identity.districtId());
      }
      case "DS" -> {
        if (identity.dsDivisionId() == null)
          throw new BadRequestException("ds scope missing");
        complaints = complaintRepository.findByIncidentDsDivisionIdOrderByCreatedAtDesc(identity.dsDivisionId());
      }
      case "GS" -> {
        if (identity.gnDivisionId() == null)
          throw new BadRequestException("gn scope missing");
        complaints = complaintRepository.findByIncidentGnDivisionIdOrderByCreatedAtDesc(identity.gnDivisionId());
      }
      case "DEPT_HEAD" -> {
        if (identity.departmentId() == null) {
          throw new BadRequestException("department scope missing");
        }
        complaints = complaintRepository.findBySelectedDepartmentIdOrderByCreatedAtDesc(identity.departmentId());
      }
      default -> complaints = List.of();
    }

    if (!"DEPT_HEAD".equalsIgnoreCase(level)) {
      complaints = complaints.stream().filter(c -> !isDepartmentRouted(c)).toList();
    } else {
      complaints = complaints.stream().filter(this::isDepartmentRouted).toList();
    }

    return complaints.stream().map(this::toDto).toList();
  }

  @Transactional
  public ComplaintDto assign(IdentityMeResponse actorIdentity, UUID complaintId, UUID assignedToUserId, String reason) {
    UUID actorUserId = requireAuthority(actorIdentity);

    Complaint c = complaintRepository.findById(complaintId)
        .orElseThrow(() -> new NotFoundException("complaint not found"));

    ensureCanViewInQueue(actorIdentity, c);

    Instant now = Instant.now();

    ComplaintAssignment assignment = new ComplaintAssignment();
    assignment.setId(UUID.randomUUID());
    assignment.setComplaintId(complaintId);
    assignment.setAssignedToUserId(assignedToUserId);
    assignment.setAssignedByUserId(actorUserId);
    assignment.setAssignedAt(now);
    assignment.setAssignmentReason(reason);
    assignmentRepository.save(assignment);

    ComplaintStatus from = c.getStatus();
    c.setStatus(ComplaintStatus.assigned);
    c.setUpdatedAt(now);
    complaintRepository.save(c);

    createStatusHistory(complaintId, from == null ? null : from.name(), c.getStatus().name(), actorUserId, reason, now);
    return toDto(c);
  }

  @Transactional
  public ComplaintDto updateStatus(IdentityMeResponse actorIdentity, UUID complaintId, ComplaintStatus toStatus,
      String note) {
    UUID actorUserId = requireAuthority(actorIdentity);

    if (toStatus == null) {
      throw new BadRequestException("toStatus is required");
    }

    Complaint c = complaintRepository.findById(complaintId)
        .orElseThrow(() -> new NotFoundException("complaint not found"));

    ensureCanViewInQueue(actorIdentity, c);

    Instant now = Instant.now();
    ComplaintStatus from = c.getStatus();

    c.setStatus(toStatus);
    if (toStatus == ComplaintStatus.rejected) {
      c.setRejected(true);
      c.setRejectedReason(note);
    }
    c.setUpdatedAt(now);
    complaintRepository.save(c);

    createStatusHistory(complaintId, from == null ? null : from.name(), toStatus.name(), actorUserId, note, now);
    return toDto(c);
  }

  @Transactional
  public void addInternalNote(IdentityMeResponse actorIdentity, UUID complaintId, String note) {
    UUID actorUserId = requireAuthority(actorIdentity);
    if (note == null || note.isBlank()) {
      throw new BadRequestException("note is required");
    }

    Complaint c = complaintRepository.findById(complaintId)
        .orElseThrow(() -> new NotFoundException("complaint not found"));
    ensureCanViewInQueue(actorIdentity, c);

    ComplaintInternalNote internalNote = new ComplaintInternalNote();
    internalNote.setId(UUID.randomUUID());
    internalNote.setComplaintId(complaintId);
    internalNote.setCreatedByUserId(actorUserId);
    internalNote.setNote(note);
    internalNote.setCreatedAt(Instant.now());
    internalNoteRepository.save(internalNote);
  }

  @Transactional
  public void addResponse(IdentityMeResponse actorIdentity, UUID complaintId, String message) {
    UUID actorUserId = requireAuthority(actorIdentity);
    if (message == null || message.isBlank()) {
      throw new BadRequestException("message is required");
    }

    Complaint c = complaintRepository.findById(complaintId)
        .orElseThrow(() -> new NotFoundException("complaint not found"));
    ensureCanViewInQueue(actorIdentity, c);

    ComplaintResponse response = new ComplaintResponse();
    response.setId(UUID.randomUUID());
    response.setComplaintId(complaintId);
    response.setCreatedByUserId(actorUserId);
    response.setMessage(message);
    response.setMessageType(ComplaintResponseType.AUTHORITY_RESPONSE);
    response.setCreatedAt(Instant.now());
    responseRepository.save(response);
  }

  @Transactional
  public ComplaintDto requestCitizenDetails(IdentityMeResponse actorIdentity, UUID complaintId, String message) {
    UUID actorUserId = requireAuthority(actorIdentity);
    if (message == null || message.isBlank()) {
      throw new BadRequestException("message is required");
    }

    Complaint c = complaintRepository.findById(complaintId)
        .orElseThrow(() -> new NotFoundException("complaint not found"));
    ensureCanViewInQueue(actorIdentity, c);

    Instant now = Instant.now();

    ComplaintResponse response = new ComplaintResponse();
    response.setId(UUID.randomUUID());
    response.setComplaintId(complaintId);
    response.setCreatedByUserId(actorUserId);
    response.setMessage(message);
    response.setMessageType(ComplaintResponseType.AUTHORITY_DETAILS_REQUEST);
    response.setCreatedAt(now);
    responseRepository.save(response);

    ComplaintStatus from = c.getStatus();
    c.setStatus(ComplaintStatus.awaiting_citizen_details);
    c.setUpdatedAt(now);
    complaintRepository.save(c);

    createStatusHistory(complaintId, from == null ? null : from.name(), c.getStatus().name(), actorUserId,
        "details requested", now);
    return toDto(c);
  }

  @Transactional
  public ComplaintDto citizenProvideDetails(UUID citizenUserId, UUID complaintId, String message) {
    if (citizenUserId == null) {
      throw new BadRequestException("citizenUserId is required");
    }
    if (message == null || message.isBlank()) {
      throw new BadRequestException("message is required");
    }

    Complaint c = complaintRepository.findById(complaintId)
        .orElseThrow(() -> new NotFoundException("complaint not found"));

    if (!citizenUserId.equals(c.getSubmittedByUserId())) {
      throw new ForbiddenException("not authorized");
    }

    if (c.getStatus() != ComplaintStatus.awaiting_citizen_details) {
      throw new BadRequestException("complaint is not awaiting citizen details");
    }

    Instant now = Instant.now();

    ComplaintResponse response = new ComplaintResponse();
    response.setId(UUID.randomUUID());
    response.setComplaintId(complaintId);
    response.setCreatedByUserId(citizenUserId);
    response.setMessage(message);
    response.setMessageType(ComplaintResponseType.CITIZEN_DETAILS);
    response.setCreatedAt(now);
    responseRepository.save(response);

    ComplaintStatus from = c.getStatus();
    c.setStatus(ComplaintStatus.under_review);
    c.setUpdatedAt(now);
    complaintRepository.save(c);

    createStatusHistory(complaintId, from.name(), c.getStatus().name(), citizenUserId, "details provided", now);
    return toDto(c);
  }

  @Transactional(readOnly = true)
  public ComplaintTimelineResponse timeline(IdentityMeResponse actorIdentity, UUID complaintId) {
    requireAuthority(actorIdentity);

    Complaint c = complaintRepository.findById(complaintId)
        .orElseThrow(() -> new NotFoundException("complaint not found"));

    ensureCanViewInQueue(actorIdentity, c);

    return buildTimelineResponse(c, complaintId);
  }

  @Transactional(readOnly = true)
  public ComplaintTimelineResponse timelineForActor(IdentityMeResponse identity,
                                                    UUID actorUserId,
                                                    String actorUserType,
                                                    UUID complaintId) {
    Complaint c = complaintRepository.findById(complaintId)
        .orElseThrow(() -> new NotFoundException("complaint not found"));

    if (actorUserType == null) {
      throw new ForbiddenException("not authorized");
    }

    if ("citizen".equalsIgnoreCase(actorUserType)) {
      if (actorUserId == null || !actorUserId.equals(c.getSubmittedByUserId())) {
        throw new ForbiddenException("not authorized");
      }
      return buildTimelineResponse(c, complaintId);
    }

    requireAuthority(identity);
    ensureCanViewInQueue(identity, c);
    return buildTimelineResponse(c, complaintId);
  }

  private ComplaintTimelineResponse buildTimelineResponse(Complaint c, UUID complaintId) {

    List<ComplaintTimelineItemDto> items = new java.util.ArrayList<>();

    for (ComplaintStatusHistory h : statusHistoryRepository.findByComplaintIdOrderByCreatedAtAsc(complaintId)) {
      items.add(new ComplaintTimelineItemDto(
          "status_change",
          h.getCreatedAt(),
          h.getChangedByUserId(),
          h.getNote(),
          h.getFromStatus(),
          h.getToStatus(),
          null));
    }

    for (ComplaintAssignment a : assignmentRepository.findByComplaintIdOrderByAssignedAtAsc(complaintId)) {
      items.add(new ComplaintTimelineItemDto(
          "assignment",
          a.getAssignedAt(),
          a.getAssignedByUserId(),
          a.getAssignmentReason(),
          null,
          null,
          a.getAssignedToUserId()));
    }

    for (ComplaintInternalNote n : internalNoteRepository.findByComplaintIdOrderByCreatedAtAsc(complaintId)) {
      items.add(new ComplaintTimelineItemDto(
          "internal_note",
          n.getCreatedAt(),
          n.getCreatedByUserId(),
          n.getNote(),
          null,
          null,
          null));
    }

    for (ComplaintResponse r : responseRepository.findByComplaintIdOrderByCreatedAtAsc(complaintId)) {
      String responseType = "response";
      if (r.getMessageType() != null) {
        responseType = switch (r.getMessageType()) {
          case AUTHORITY_RESPONSE -> "authority_response";
          case AUTHORITY_DETAILS_REQUEST -> "authority_details_request";
          case CITIZEN_DETAILS -> "citizen_details";
        };
      }
      items.add(new ComplaintTimelineItemDto(
          responseType,
          r.getCreatedAt(),
          r.getCreatedByUserId(),
          r.getMessage(),
          null,
          null,
          null));
    }

    items.sort(java.util.Comparator.comparing(ComplaintTimelineItemDto::createdAt));
    return new ComplaintTimelineResponse(toDto(c), items);
  }

  private UUID requireAuthority(IdentityMeResponse identity) {
    if (identity == null || identity.userType() == null || identity.userId() == null) {
      throw new BadRequestException("identity not available");
    }
    if (!"authority".equalsIgnoreCase(identity.userType())
        && !"developer_admin".equalsIgnoreCase(identity.userType())) {
      throw new ForbiddenException("not authorized");
    }
    return identity.userId();
  }

  private void ensureCanViewInQueue(IdentityMeResponse identity, Complaint complaint) {
    String level = identity.officialRoleLevel();
    if (level == null) {
      throw new ForbiddenException("authority profile not found");
    }

    if (isDepartmentRouted(complaint)) {
      if (!"DEPT_HEAD".equalsIgnoreCase(level)) {
        throw new ForbiddenException("out of scope");
      }
      if (identity.departmentId() == null) {
        throw new BadRequestException("department scope missing");
      }
      if (complaint.getSelectedDepartmentId() == null
          || !identity.departmentId().equals(complaint.getSelectedDepartmentId())) {
        throw new ForbiddenException("out of scope");
      }
      return;
    }

    switch (level) {
      case "CENTRAL" -> {
      }
      case "PROVINCIAL" -> {
        if (identity.provinceId() == null)
          throw new BadRequestException("province scope missing");
        if (!identity.provinceId().equals(complaint.getIncidentProvinceId()))
          throw new ForbiddenException("out of scope");
      }
      case "DSD" -> {
        if (identity.districtId() == null)
          throw new BadRequestException("district scope missing");
        if (!identity.districtId().equals(complaint.getIncidentDistrictId()))
          throw new ForbiddenException("out of scope");
      }
      case "DS" -> {
        if (identity.dsDivisionId() == null)
          throw new BadRequestException("ds scope missing");
        if (!identity.dsDivisionId().equals(complaint.getIncidentDsDivisionId()))
          throw new ForbiddenException("out of scope");
      }
      case "GS" -> {
        if (identity.gnDivisionId() == null)
          throw new BadRequestException("gn scope missing");
        if (complaint.getIncidentGnDivisionId() == null
            || !identity.gnDivisionId().equals(complaint.getIncidentGnDivisionId())) {
          throw new ForbiddenException("out of scope");
        }
      }
      case "DEPT_HEAD" -> throw new ForbiddenException("out of scope");
      default -> throw new ForbiddenException("out of scope");
    }
  }

  private boolean isDepartmentRouted(Complaint complaint) {
    return complaint != null
        && (complaint.getTargetType() == TargetType.department
            || complaint.getTargetType() == TargetType.statutory_board);
  }

  private void createStatusHistory(UUID complaintId,
      String fromStatus,
      String toStatus,
      UUID changedByUserId,
      String note,
      Instant createdAt) {
    ComplaintStatusHistory history = new ComplaintStatusHistory();
    history.setId(UUID.randomUUID());
    history.setComplaintId(complaintId);
    history.setFromStatus(fromStatus);
    history.setToStatus(toStatus);
    history.setChangedByUserId(changedByUserId);
    history.setNote(note);
    history.setCreatedAt(createdAt == null ? Instant.now() : createdAt);
    statusHistoryRepository.save(history);
  }

  private ComplaintDto toDto(Complaint c) {
    return new ComplaintDto(
        c.getId(),
        c.getComplaintCode(),
        c.getSubmittedByUserId(),
        c.getCategoryCode(),
        c.getDescriptionText(),
        c.getTargetType(),
        c.getSelectedDepartmentId(),
        c.getSelectedStatutoryBoardId(),
        c.getIncidentProvinceId(),
        c.getIncidentDistrictId(),
        c.getIncidentDsDivisionId(),
        c.getIncidentGnDivisionId(),
        c.getStatus(),
        c.getCreatedAt(),
        c.getUpdatedAt());
  }
}
