package com.govconnect.complaints.service;

import java.security.SecureRandom;

import org.springframework.stereotype.Service;

@Service
public class ComplaintCodeService {

  private static final String ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  private static final SecureRandom RNG = new SecureRandom();

  public String generate() {
    StringBuilder sb = new StringBuilder();
    sb.append("GC-");
    for (int i = 0; i < 10; i++) {
      sb.append(ALPHABET.charAt(RNG.nextInt(ALPHABET.length())));
    }
    return sb.toString();
  }
}
