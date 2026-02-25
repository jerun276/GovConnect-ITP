package com.govconnect.departments.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.govconnect.common.api.BadRequestException;
import com.govconnect.common.api.NotFoundException;
import com.govconnect.departments.api.dto.StatutoryBoardDto;
import com.govconnect.departments.domain.StatutoryBoard;
import com.govconnect.departments.repo.StatutoryBoardRepository;

@RestController
@RequestMapping("/api/statutory-boards")
public class StatutoryBoardController {

  private final StatutoryBoardRepository statutoryBoardRepository;

  public StatutoryBoardController(StatutoryBoardRepository statutoryBoardRepository) {
    this.statutoryBoardRepository = statutoryBoardRepository;
  }

  @GetMapping
  public ResponseEntity<List<StatutoryBoardDto>> list(
      @RequestParam(name = "department_id", required = false) UUID departmentId,
      @RequestParam(name = "q", required = false) String q) {

    List<StatutoryBoard> boards;

    if (departmentId != null) {
      boards = statutoryBoardRepository.findByDepartment_Id(departmentId);
    } else if (q != null && !q.isBlank()) {
      boards = statutoryBoardRepository.findByNameContainingIgnoreCaseOrderByNameAsc(q.trim());
    } else {
      boards = statutoryBoardRepository.findAll();
    }

    return ResponseEntity.ok(boards.stream().map(this::toDto).toList());
  }

  @GetMapping("/{id}")
  public ResponseEntity<StatutoryBoardDto> get(@PathVariable UUID id) {
    if (id == null) {
      throw new BadRequestException("id is required");
    }
    StatutoryBoard board = statutoryBoardRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("statutory board not found"));
    return ResponseEntity.ok(toDto(board));
  }

  private StatutoryBoardDto toDto(StatutoryBoard b) {
    return new StatutoryBoardDto(b.getId(), b.getDepartment().getId(), b.getName());
  }
}
