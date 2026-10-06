package com.nexuspc.auth.dto;
import com.nexuspc.user.User;
import java.time.Instant;
public record UserResponse(Long id, String name, String email, String phone, String role, Instant createdAt) {
 public static UserResponse from(User u) {
  return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getPhone(), u.getRole().name(), u.getCreatedAt());
 }
}
