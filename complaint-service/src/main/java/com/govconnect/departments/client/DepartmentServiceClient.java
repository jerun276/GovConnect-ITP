package com.govconnect.departments.client;

import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class DepartmentServiceClient {

  private final RestClient restClient;

  public DepartmentServiceClient(@Value("${clients.department-service.base-url:http://localhost:8082}") String baseUrl) {
    String safeBaseUrl = Objects.requireNonNull(baseUrl);
    this.restClient = RestClient.builder()
        .baseUrl(safeBaseUrl)
        .build();
  }

  public StatutoryBoardDto getStatutoryBoard(UUID boardId, String authorizationHeader) {
    RestClient.RequestHeadersSpec<?> req = restClient.get()
        .uri("/api/statutory-boards/{id}", boardId);

    if (authorizationHeader != null && !authorizationHeader.isBlank()) {
      req = req.header(HttpHeaders.AUTHORIZATION, authorizationHeader);
    }

    return req.retrieve().body(StatutoryBoardDto.class);
  }
}
