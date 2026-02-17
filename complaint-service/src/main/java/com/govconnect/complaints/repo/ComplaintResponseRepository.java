package com.govconnect.complaints.repo;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.govconnect.complaints.domain.ComplaintResponse;

public interface ComplaintResponseRepository extends JpaRepository<ComplaintResponse, UUID> {

  List<ComplaintResponse> findByComplaintIdOrderByCreatedAtAsc(UUID complaintId);
}
