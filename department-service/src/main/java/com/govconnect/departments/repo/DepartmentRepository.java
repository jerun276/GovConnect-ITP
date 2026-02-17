package com.govconnect.departments.repo;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.govconnect.departments.domain.Department;

public interface DepartmentRepository extends JpaRepository<Department, UUID> {}
