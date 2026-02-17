package com.govconnect.complaints.domain;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "complaint_assignments")
public class ComplaintAssignment {

  @Id
  private UUID id;

  @Column(name = "complaint_id", nullable = false)
  private UUID complaintId;

  @Column(name = "assigned_to_user_id", nullable = false)
  private UUID assignedToUserId;

  @Column(name = "assigned_by_user_id", nullable = false)
  private UUID assignedByUserId;

  @Column(name = "assigned_at", nullable = false)
  private Instant assignedAt;

  @Column(name = "assignment_reason")
  private String assignmentReason;

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public UUID getComplaintId() {
    return complaintId;
  }

  public void setComplaintId(UUID complaintId) {
    this.complaintId = complaintId;
  }

  public UUID getAssignedToUserId() {
    return assignedToUserId;
  }

  public void setAssignedToUserId(UUID assignedToUserId) {
    this.assignedToUserId = assignedToUserId;
  }

  public UUID getAssignedByUserId() {
    return assignedByUserId;
  }

  public void setAssignedByUserId(UUID assignedByUserId) {
    this.assignedByUserId = assignedByUserId;
  }

  public Instant getAssignedAt() {
    return assignedAt;
  }

  public void setAssignedAt(Instant assignedAt) {
    this.assignedAt = assignedAt;
  }

  public String getAssignmentReason() {
    return assignmentReason;
  }

  public void setAssignmentReason(String assignmentReason) {
    this.assignmentReason = assignmentReason;
  }
}
