package com.nexuspc.admin;
import com.nexuspc.user.*; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.web.bind.annotation.*; import java.time.Instant; import java.util.*;
@RestController @RequestMapping("/api/admin/customers") @PreAuthorize("hasRole('ADMIN')") public class AdminCustomerController {
 private final UserRepository users; public AdminCustomerController(UserRepository u){users=u;}
 public record Customer(Long id,String name,String email,String phone,String role,Instant createdAt){}
 @GetMapping public List<Customer> list(){return users.findAll().stream().map(u->new Customer(u.getId(),u.getName(),u.getEmail(),u.getPhone(),u.getRole().name(),u.getCreatedAt())).toList();}
}
