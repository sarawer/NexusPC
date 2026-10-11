package com.nexuspc.admin.dto;

import jakarta.validation.constraints.NotBlank;

public record ChangeUserRoleRequest(
        @NotBlank String role,
        @NotBlank(message = "Current password is required") String currentPassword
) {}
