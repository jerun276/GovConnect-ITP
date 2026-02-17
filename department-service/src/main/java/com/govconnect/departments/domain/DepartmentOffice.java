package com.govconnect.departments.domain;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "department_offices")
public class DepartmentOffice {

  @Id
  private UUID id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "department_id", nullable = false)
  private Department department;

  @Column(name = "district_id", nullable = false)
  private UUID districtId;

  @Column(name = "office_name", nullable = false)
  private String officeName;

  @Column(name = "address")
  private String address;

  @Column(name = "is_head_office", nullable = false)
  private boolean headOffice;

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public Department getDepartment() {
    return department;
  }

  public void setDepartment(Department department) {
    this.department = department;
  }

  public UUID getDistrictId() {
    return districtId;
  }

  public void setDistrictId(UUID districtId) {
    this.districtId = districtId;
  }

  public String getOfficeName() {
    return officeName;
  }

  public void setOfficeName(String officeName) {
    this.officeName = officeName;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public boolean isHeadOffice() {
    return headOffice;
  }

  public void setHeadOffice(boolean headOffice) {
    this.headOffice = headOffice;
  }
}
