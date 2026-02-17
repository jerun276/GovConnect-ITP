package com.govconnect.complaints.domain;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "complaints")
public class Complaint {

  @Id
  private UUID id;

  @Column(name = "complaint_code", nullable = false, unique = true)
  private String complaintCode;

  @Column(name = "submitted_by_user_id", nullable = false)
  private UUID submittedByUserId;

  @Column(name = "category_code", nullable = false)
  private String categoryCode;

  @Column(name = "description_text", nullable = false)
  private String descriptionText;

  @Enumerated(EnumType.STRING)
  @Column(name = "target_type", nullable = false)
  private TargetType targetType;

  @Column(name = "target_official_level")
  private String targetOfficialLevel;

  @Column(name = "target_official_user_id")
  private UUID targetOfficialUserId;

  @Column(name = "direct_to_target_requested", nullable = false)
  private boolean directToTargetRequested;

  @Column(name = "selected_department_id")
  private UUID selectedDepartmentId;

  @Column(name = "incident_province_id", nullable = false)
  private UUID incidentProvinceId;

  @Column(name = "incident_district_id", nullable = false)
  private UUID incidentDistrictId;

  @Column(name = "incident_ds_division_id", nullable = false)
  private UUID incidentDsDivisionId;

  @Column(name = "incident_gn_division_id")
  private UUID incidentGnDivisionId;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private ComplaintStatus status;

  @Column(name = "priority")
  private String priority;

  @Column(name = "risk_label")
  private String riskLabel;

  @Column(name = "is_rejected", nullable = false)
  private boolean rejected;

  @Column(name = "rejected_reason")
  private String rejectedReason;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public String getComplaintCode() {
    return complaintCode;
  }

  public void setComplaintCode(String complaintCode) {
    this.complaintCode = complaintCode;
  }

  public UUID getSubmittedByUserId() {
    return submittedByUserId;
  }

  public void setSubmittedByUserId(UUID submittedByUserId) {
    this.submittedByUserId = submittedByUserId;
  }

  public String getCategoryCode() {
    return categoryCode;
  }

  public void setCategoryCode(String categoryCode) {
    this.categoryCode = categoryCode;
  }

  public String getDescriptionText() {
    return descriptionText;
  }

  public void setDescriptionText(String descriptionText) {
    this.descriptionText = descriptionText;
  }

  public TargetType getTargetType() {
    return targetType;
  }

  public void setTargetType(TargetType targetType) {
    this.targetType = targetType;
  }

  public String getTargetOfficialLevel() {
    return targetOfficialLevel;
  }

  public void setTargetOfficialLevel(String targetOfficialLevel) {
    this.targetOfficialLevel = targetOfficialLevel;
  }

  public UUID getTargetOfficialUserId() {
    return targetOfficialUserId;
  }

  public void setTargetOfficialUserId(UUID targetOfficialUserId) {
    this.targetOfficialUserId = targetOfficialUserId;
  }

  public boolean isDirectToTargetRequested() {
    return directToTargetRequested;
  }

  public void setDirectToTargetRequested(boolean directToTargetRequested) {
    this.directToTargetRequested = directToTargetRequested;
  }

  public UUID getSelectedDepartmentId() {
    return selectedDepartmentId;
  }

  public void setSelectedDepartmentId(UUID selectedDepartmentId) {
    this.selectedDepartmentId = selectedDepartmentId;
  }

  public UUID getIncidentProvinceId() {
    return incidentProvinceId;
  }

  public void setIncidentProvinceId(UUID incidentProvinceId) {
    this.incidentProvinceId = incidentProvinceId;
  }

  public UUID getIncidentDistrictId() {
    return incidentDistrictId;
  }

  public void setIncidentDistrictId(UUID incidentDistrictId) {
    this.incidentDistrictId = incidentDistrictId;
  }

  public UUID getIncidentDsDivisionId() {
    return incidentDsDivisionId;
  }

  public void setIncidentDsDivisionId(UUID incidentDsDivisionId) {
    this.incidentDsDivisionId = incidentDsDivisionId;
  }

  public UUID getIncidentGnDivisionId() {
    return incidentGnDivisionId;
  }

  public void setIncidentGnDivisionId(UUID incidentGnDivisionId) {
    this.incidentGnDivisionId = incidentGnDivisionId;
  }

  public ComplaintStatus getStatus() {
    return status;
  }

  public void setStatus(ComplaintStatus status) {
    this.status = status;
  }

  public String getPriority() {
    return priority;
  }

  public void setPriority(String priority) {
    this.priority = priority;
  }

  public String getRiskLabel() {
    return riskLabel;
  }

  public void setRiskLabel(String riskLabel) {
    this.riskLabel = riskLabel;
  }

  public boolean isRejected() {
    return rejected;
  }

  public void setRejected(boolean rejected) {
    this.rejected = rejected;
  }

  public String getRejectedReason() {
    return rejectedReason;
  }

  public void setRejectedReason(String rejectedReason) {
    this.rejectedReason = rejectedReason;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(Instant updatedAt) {
    this.updatedAt = updatedAt;
  }
}
