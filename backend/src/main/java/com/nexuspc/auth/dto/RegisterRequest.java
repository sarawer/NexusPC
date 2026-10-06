package com.nexuspc.auth.dto;
import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Email @Size(max = 254) String email,
        @Size(max = 30) String phone,
        @NotBlank @Size(min = 8, max = 128) String password) {
}
