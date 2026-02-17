package com.govconnect.complaints.repo;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.govconnect.complaints.domain.ComplaintAssignment;

public interface ComplaintAssignmentRepository extends JpaRepository<ComplaintAssignment, UUID> {

  List<ComplaintAssignment> findByComplaintIdOrderByAssignedAtAsc(UUID complaintId);
}
