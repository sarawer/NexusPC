package com.nexuspc.admin.dto;

import jakarta.validation.constraints.NotBlank;

public record MakeAdminRequest(
        @NotBlank(message = "Current password is required")
        String currentPassword
) {
}
