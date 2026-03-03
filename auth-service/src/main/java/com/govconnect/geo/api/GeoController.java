package com.govconnect.geo.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@RestController
@RequestMapping("/api/geo")
public class GeoController {

  @PersistenceContext
  private EntityManager entityManager;

  private static UUID toUuid(Object value) {
    if (value == null) return null;
    if (value instanceof UUID uuid) return uuid;
    return UUID.fromString(value.toString());
  }

  public record ProvinceDto(UUID id, String name) {}

  public record DistrictDto(UUID id, UUID provinceId, String name) {}

  public record DsDivisionDto(UUID id, UUID districtId, String name) {}

  public record GnDivisionDto(UUID id, UUID dsDivisionId, String name, String gnCode) {}

  @GetMapping("/provinces")
  public ResponseEntity<List<ProvinceDto>> provinces() {
    @SuppressWarnings("unchecked")
    List<Object[]> rows = entityManager
        .createNativeQuery("select p.id, p.name from provinces p order by p.name asc")
        .getResultList();

    List<ProvinceDto> result = rows.stream()
        .map(r -> new ProvinceDto(toUuid(r[0]), (String) r[1]))
        .toList();

    return ResponseEntity.ok(result);
  }

  @GetMapping("/provinces/{provinceId}/districts")
  public ResponseEntity<List<DistrictDto>> districtsByProvince(@PathVariable UUID provinceId) {
    @SuppressWarnings("unchecked")
    List<Object[]> rows = entityManager
        .createNativeQuery("select d.id, d.province_id, d.name from districts d where d.province_id = ?1 order by d.name asc")
        .setParameter(1, provinceId)
        .getResultList();

    List<DistrictDto> result = rows.stream()
        .map(r -> new DistrictDto(toUuid(r[0]), toUuid(r[1]), (String) r[2]))
        .toList();

    return ResponseEntity.ok(result);
  }

  @GetMapping("/districts/{districtId}/ds-divisions")
  public ResponseEntity<List<DsDivisionDto>> dsDivisionsByDistrict(@PathVariable UUID districtId) {
    @SuppressWarnings("unchecked")
    List<Object[]> rows = entityManager
        .createNativeQuery("select ds.id, ds.district_id, ds.name from ds_divisions ds where ds.district_id = ?1 order by ds.name asc")
        .setParameter(1, districtId)
        .getResultList();

    List<DsDivisionDto> result = rows.stream()
        .map(r -> new DsDivisionDto(toUuid(r[0]), toUuid(r[1]), (String) r[2]))
        .toList();

    return ResponseEntity.ok(result);
  }

  @GetMapping("/ds-divisions/{dsDivisionId}/gn-divisions")
  public ResponseEntity<List<GnDivisionDto>> gnDivisionsByDsDivision(@PathVariable UUID dsDivisionId) {
    @SuppressWarnings("unchecked")
    List<Object[]> rows = entityManager
        .createNativeQuery("select gn.id, gn.ds_division_id, gn.name, gn.gn_code from gn_divisions gn where gn.ds_division_id = ?1 order by gn.name asc")
        .setParameter(1, dsDivisionId)
        .getResultList();

    List<GnDivisionDto> result = rows.stream()
        .map(r -> new GnDivisionDto(toUuid(r[0]), toUuid(r[1]), (String) r[2], (String) r[3]))
        .toList();

    return ResponseEntity.ok(result);
  }
}
