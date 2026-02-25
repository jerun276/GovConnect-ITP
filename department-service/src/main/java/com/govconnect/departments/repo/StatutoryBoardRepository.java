package com.govconnect.departments.repo;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.govconnect.departments.domain.StatutoryBoard;

public interface StatutoryBoardRepository extends JpaRepository<StatutoryBoard, UUID> {

  List<StatutoryBoard> findByDepartment_Id(UUID departmentId);

  List<StatutoryBoard> findByNameContainingIgnoreCaseOrderByNameAsc(String q);
}
