package com.nexuspc.admin;
import com.nexuspc.admin.dto.MakeAdminRequest;
import com.nexuspc.auth.dto.UserResponse;
import com.nexuspc.user.*; import jakarta.validation.Valid; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.time.Instant; import java.util.*;
@RestController @RequestMapping("/api/admin/customers") @PreAuthorize("hasRole('ADMIN')") public class AdminCustomerController {
 private final AdminUserService adminUsers; public AdminCustomerController(AdminUserService adminUsers){this.adminUsers=adminUsers;}
 public record Customer(Long id,String name,String email,String phone,String role,Instant createdAt){}
 @GetMapping public List<AdminUserService.AdminCustomerView> list(){return adminUsers.listUsers();}
 @PostMapping("/{id}/make-admin")
 public UserResponse makeAdmin(@PathVariable Long id, @Valid @RequestBody MakeAdminRequest request, Authentication authentication) {
  return adminUsers.makeAdmin(id, authentication.getName(), request.currentPassword());
 }
}
