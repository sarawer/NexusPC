package com.nexuspc.admin;
import com.nexuspc.admin.dto.ChangeUserRoleRequest;
import com.nexuspc.auth.dto.UserResponse;
import com.nexuspc.user.*; import jakarta.validation.Valid; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.time.Instant; import java.util.*;
@RestController @RequestMapping("/api/admin/customers") @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')") public class AdminCustomerController {
 private final AdminUserService adminUsers; public AdminCustomerController(AdminUserService adminUsers){this.adminUsers=adminUsers;}

 @GetMapping public List<AdminUserService.AdminCustomerView> list(){return adminUsers.listUsers();}
 @PreAuthorize("hasRole('SUPER_ADMIN')") @PutMapping("/{id}/role")
 public UserResponse changeRole(@PathVariable Long id, @Valid @RequestBody ChangeUserRoleRequest request, Authentication authentication) {
  return adminUsers.changeRole(id, authentication.getName(), request.role(), request.currentPassword());
 }
}
