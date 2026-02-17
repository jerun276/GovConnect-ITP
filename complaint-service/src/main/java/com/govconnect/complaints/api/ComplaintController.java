package com.govconnect.complaints.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.govconnect.complaints.api.dto.AddInternalNoteRequest;
import com.govconnect.complaints.api.dto.AddResponseRequest;
import com.govconnect.complaints.api.dto.AssignComplaintRequest;
import com.govconnect.complaints.api.dto.ComplaintDto;
import com.govconnect.complaints.api.dto.ComplaintTimelineResponse;
import com.govconnect.complaints.api.dto.CreateComplaintRequest;
import com.govconnect.complaints.api.dto.UpdateComplaintStatusRequest;
import com.govconnect.complaints.service.ComplaintService;
import com.govconnect.identity.client.AuthServiceClient;
import com.govconnect.identity.client.IdentityMeResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/complaints")
@Validated
public class ComplaintController {

  private final ComplaintService complaintService;
  private final AuthServiceClient authServiceClient;

  public ComplaintController(ComplaintService complaintService,
                             AuthServiceClient authServiceClient) {
    this.complaintService = complaintService;
    this.authServiceClient = authServiceClient;
  }

  @PostMapping
  public ResponseEntity<ComplaintDto> create(@AuthenticationPrincipal Jwt jwt,
                                            @Valid @RequestBody CreateComplaintRequest request) {
    UUID userId = UUID.fromString(jwt.getSubject());
    return ResponseEntity.ok(complaintService.create(userId, request));
  }

  @GetMapping("/mine")
  public ResponseEntity<List<ComplaintDto>> mine(@AuthenticationPrincipal Jwt jwt) {
    UUID userId = UUID.fromString(jwt.getSubject());
    return ResponseEntity.ok(complaintService.myComplaints(userId));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ComplaintDto> get(@PathVariable UUID id) {
    return ResponseEntity.ok(complaintService.get(id));
  }

  @GetMapping("/queue")
  public ResponseEntity<List<ComplaintDto>> queue(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization) {
    IdentityMeResponse identity = authServiceClient.me(authorization);
    return ResponseEntity.ok(complaintService.queue(identity));
  }

  @PostMapping("/{id}/assign")
  public ResponseEntity<ComplaintDto> assign(@PathVariable UUID id,
                                             @RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
                                             @Valid @RequestBody AssignComplaintRequest request) {
    IdentityMeResponse identity = authServiceClient.me(authorization);
    return ResponseEntity.ok(complaintService.assign(identity, id, request.assignedToUserId(), request.reason()));
  }

  @PostMapping("/{id}/status")
  public ResponseEntity<ComplaintDto> updateStatus(@PathVariable UUID id,
                                                   @RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
                                                   @Valid @RequestBody UpdateComplaintStatusRequest request) {
    IdentityMeResponse identity = authServiceClient.me(authorization);
    return ResponseEntity.ok(complaintService.updateStatus(identity, id, request.toStatus(), request.note()));
  }

  @PostMapping("/{id}/internal-notes")
  public ResponseEntity<Void> addInternalNote(@PathVariable UUID id,
                                              @RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
                                              @Valid @RequestBody AddInternalNoteRequest request) {
    IdentityMeResponse identity = authServiceClient.me(authorization);
    complaintService.addInternalNote(identity, id, request.note());
    return ResponseEntity.ok().build();
  }

  @PostMapping("/{id}/responses")
  public ResponseEntity<Void> addResponse(@PathVariable UUID id,
                                          @RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
                                          @Valid @RequestBody AddResponseRequest request) {
    IdentityMeResponse identity = authServiceClient.me(authorization);
    complaintService.addResponse(identity, id, request.message());
    return ResponseEntity.ok().build();
  }

  @GetMapping("/{id}/timeline")
  public ResponseEntity<ComplaintTimelineResponse> timeline(@PathVariable UUID id,
                                                            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorization) {
    IdentityMeResponse identity = authServiceClient.me(authorization);
    return ResponseEntity.ok(complaintService.timeline(identity, id));
  }
}
