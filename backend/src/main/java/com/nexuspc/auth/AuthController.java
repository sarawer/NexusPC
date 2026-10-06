package com.nexuspc.auth;
import com.nexuspc.auth.dto.*;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth")
public class AuthController {
 private final AuthService service;
 public AuthController(AuthService service){this.service=service;}
 @PostMapping("/register") public AuthResponse register(@Valid @RequestBody RegisterRequest r){return service.register(r);}
 @PostMapping("/login") public AuthResponse login(@Valid @RequestBody LoginRequest r){return service.login(r);}
 @GetMapping("/me") public UserResponse me(Authentication a){return UserResponse.from(service.current(a.getName()));}
 @PutMapping("/me") public UserResponse updateMe(Authentication a,@Valid @RequestBody UpdateProfileRequest r){return UserResponse.from(service.updateProfile(a.getName(),r));}
}
