package com.govconnect.departments.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.govconnect.common.api.NotFoundException;
import com.govconnect.departments.api.dto.DepartmentDto;
import com.govconnect.departments.api.dto.DepartmentOfficeDto;
import com.govconnect.departments.api.dto.StatutoryBoardDto;
import com.govconnect.departments.domain.Department;
import com.govconnect.departments.domain.DepartmentOffice;
import com.govconnect.departments.repo.DepartmentOfficeRepository;
import com.govconnect.departments.repo.DepartmentRepository;
import com.govconnect.departments.repo.StatutoryBoardRepository;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

  private final DepartmentRepository departmentRepository;
  private final DepartmentOfficeRepository officeRepository;
  private final StatutoryBoardRepository statutoryBoardRepository;

  public DepartmentController(DepartmentRepository departmentRepository,
      DepartmentOfficeRepository officeRepository,
      StatutoryBoardRepository statutoryBoardRepository) {
    this.departmentRepository = departmentRepository;
    this.officeRepository = officeRepository;
    this.statutoryBoardRepository = statutoryBoardRepository;
  }

  @GetMapping
  public ResponseEntity<List<DepartmentDto>> list(
      @RequestParam(name = "district_id", required = false) UUID districtId) {
    List<Department> departments;

    if (districtId == null) {
      departments = departmentRepository.findAll();
    } else {
      departments = officeRepository.findByDistrictId(districtId).stream()
          .map(DepartmentOffice::getDepartment)
          .distinct()
          .toList();
    }

    return ResponseEntity.ok(departments.stream().map(this::toDto).toList());
  }

  @GetMapping("/{id}")
  public ResponseEntity<DepartmentDto> get(@PathVariable UUID id) {
    Department department = departmentRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("department not found"));
    return ResponseEntity.ok(toDto(department));
  }

  @GetMapping("/{id}/offices")
  public ResponseEntity<List<DepartmentOfficeDto>> offices(@PathVariable UUID id) {
    List<DepartmentOfficeDto> offices = officeRepository.findByDepartment_Id(id).stream()
        .map(this::toOfficeDto)
        .toList();
    return ResponseEntity.ok(offices);
  }

  @GetMapping("/{id}/statutory-boards")
  public ResponseEntity<List<StatutoryBoardDto>> statutoryBoards(@PathVariable UUID id) {
    var boards = statutoryBoardRepository.findByDepartment_Id(id).stream()
        .map(b -> new StatutoryBoardDto(b.getId(), b.getDepartment().getId(), b.getName()))
        .toList();
    return ResponseEntity.ok(boards);
  }

  private DepartmentDto toDto(Department d) {
    return new DepartmentDto(d.getId(), d.getName(), d.getType());
  }

  private DepartmentOfficeDto toOfficeDto(DepartmentOffice o) {
    return new DepartmentOfficeDto(
        o.getId(),
        o.getDepartment().getId(),
        o.getDistrictId(),
        o.getOfficeName(),
        o.getAddress(),
        o.isHeadOffice());
  }
}
