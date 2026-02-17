package com.govconnect.complaints.repo;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.govconnect.complaints.domain.ComplaintInternalNote;

public interface ComplaintInternalNoteRepository extends JpaRepository<ComplaintInternalNote, UUID> {

  List<ComplaintInternalNote> findByComplaintIdOrderByCreatedAtAsc(UUID complaintId);
}
