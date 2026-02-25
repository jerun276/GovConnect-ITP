package com.govconnect.complaints.repo;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.govconnect.complaints.domain.Complaint;

public interface ComplaintRepository extends JpaRepository<Complaint, UUID> {

  List<Complaint> findBySubmittedByUserIdOrderByCreatedAtDesc(UUID submittedByUserId);

  List<Complaint> findBySelectedDepartmentIdOrderByCreatedAtDesc(UUID selectedDepartmentId);

  List<Complaint> findByIncidentProvinceIdOrderByCreatedAtDesc(UUID provinceId);

  List<Complaint> findByIncidentDistrictIdOrderByCreatedAtDesc(UUID districtId);

  List<Complaint> findByIncidentDsDivisionIdOrderByCreatedAtDesc(UUID dsDivisionId);

  List<Complaint> findByIncidentGnDivisionIdOrderByCreatedAtDesc(UUID gnDivisionId);

  boolean existsByComplaintCode(String complaintCode);
}
