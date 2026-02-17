package com.govconnect.departments.repo;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.govconnect.departments.domain.DepartmentOffice;

public interface DepartmentOfficeRepository extends JpaRepository<DepartmentOffice, UUID> {

  List<DepartmentOffice> findByDistrictId(UUID districtId);

  List<DepartmentOffice> findByDepartment_Id(UUID departmentId);
}
