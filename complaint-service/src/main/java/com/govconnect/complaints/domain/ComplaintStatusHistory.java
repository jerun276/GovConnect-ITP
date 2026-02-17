package com.govconnect.complaints.domain;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "complaint_status_history")
public class ComplaintStatusHistory {

  @Id
  private UUID id;

  @Column(name = "complaint_id", nullable = false)
  private UUID complaintId;

  @Column(name = "from_status")
  private String fromStatus;

  @Column(name = "to_status", nullable = false)
  private String toStatus;

  @Column(name = "changed_by_user_id")
  private UUID changedByUserId;

  @Column(name = "note")
  private String note;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

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

  public String getFromStatus() {
    return fromStatus;
  }

  public void setFromStatus(String fromStatus) {
    this.fromStatus = fromStatus;
  }

  public String getToStatus() {
    return toStatus;
  }

  public void setToStatus(String toStatus) {
    this.toStatus = toStatus;
  }

  public UUID getChangedByUserId() {
    return changedByUserId;
  }

  public void setChangedByUserId(UUID changedByUserId) {
    this.changedByUserId = changedByUserId;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }
}
