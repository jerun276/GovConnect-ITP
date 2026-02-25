package com.govconnect.identity.domain;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "authority_profiles")
public class AuthorityProfile {

  @Id
  @Column(name = "user_id")
  private UUID userId;

  @Column(name = "full_name", nullable = false)
  private String fullName;

  @Enumerated(EnumType.STRING)
  @Column(name = "official_role_level", nullable = false)
  private AuthorityRoleLevel officialRoleLevel;

  @Column(name = "official_email", nullable = false)
  private String officialEmail;

  @Column(name = "province_id")
  private UUID provinceId;

  @Column(name = "district_id")
  private UUID districtId;

  @Column(name = "ds_division_id")
  private UUID dsDivisionId;

  @Column(name = "gn_division_id")
  private UUID gnDivisionId;

  @Column(name = "department_id")
  private UUID departmentId;

  @Column(name = "status", nullable = false)
  private String status;

  @Column(name = "approved_by_user_id")
  private UUID approvedByUserId;

  @Column(name = "approved_at")
  private Instant approvedAt;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  public UUID getUserId() {
    return userId;
  }

  public void setUserId(UUID userId) {
    this.userId = userId;
  }

  public String getFullName() {
    return fullName;
  }

  public void setFullName(String fullName) {
    this.fullName = fullName;
  }

  public AuthorityRoleLevel getOfficialRoleLevel() {
    return officialRoleLevel;
  }

  public void setOfficialRoleLevel(AuthorityRoleLevel officialRoleLevel) {
    this.officialRoleLevel = officialRoleLevel;
  }

  public String getOfficialEmail() {
    return officialEmail;
  }

  public void setOfficialEmail(String officialEmail) {
    this.officialEmail = officialEmail;
  }

  public UUID getProvinceId() {
    return provinceId;
  }

  public void setProvinceId(UUID provinceId) {
    this.provinceId = provinceId;
  }

  public UUID getDistrictId() {
    return districtId;
  }

  public void setDistrictId(UUID districtId) {
    this.districtId = districtId;
  }

  public UUID getDsDivisionId() {
    return dsDivisionId;
  }

  public void setDsDivisionId(UUID dsDivisionId) {
    this.dsDivisionId = dsDivisionId;
  }

  public UUID getGnDivisionId() {
    return gnDivisionId;
  }

  public void setGnDivisionId(UUID gnDivisionId) {
    this.gnDivisionId = gnDivisionId;
  }

  public UUID getDepartmentId() {
    return departmentId;
  }

  public void setDepartmentId(UUID departmentId) {
    this.departmentId = departmentId;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public UUID getApprovedByUserId() {
    return approvedByUserId;
  }

  public void setApprovedByUserId(UUID approvedByUserId) {
    this.approvedByUserId = approvedByUserId;
  }

  public Instant getApprovedAt() {
    return approvedAt;
  }

  public void setApprovedAt(Instant approvedAt) {
    this.approvedAt = approvedAt;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }
}
