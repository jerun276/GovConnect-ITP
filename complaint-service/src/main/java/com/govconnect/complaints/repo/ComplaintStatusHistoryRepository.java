package com.govconnect.complaints.repo;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.govconnect.complaints.domain.ComplaintStatusHistory;

public interface ComplaintStatusHistoryRepository extends JpaRepository<ComplaintStatusHistory, UUID> {

  List<ComplaintStatusHistory> findByComplaintIdOrderByCreatedAtAsc(UUID complaintId);
}
