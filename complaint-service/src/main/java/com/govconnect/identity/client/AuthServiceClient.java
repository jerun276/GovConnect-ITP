package com.govconnect.identity.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class AuthServiceClient {

  private final RestClient restClient;

  public AuthServiceClient(@Value("${clients.auth-service.base-url:http://localhost:8081}") String baseUrl) {
    this.restClient = RestClient.builder()
        .baseUrl(baseUrl)
        .build();
  }

  public IdentityMeResponse me(String bearerToken) {
    return restClient.get()
        .uri("/api/identity/me")
        .header(HttpHeaders.AUTHORIZATION, bearerToken)
        .retrieve()
        .body(IdentityMeResponse.class);
  }
}
