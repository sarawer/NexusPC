package com.nexuspc.auth;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {
    @GetMapping("/ping")
    @PreAuthorize("hasRole('ADMIN')")
    public String ping() {
        return "admin access granted";
    }
}
