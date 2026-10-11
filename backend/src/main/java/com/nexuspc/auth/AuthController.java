package com.nexuspc.auth;
import com.nexuspc.auth.dto.*;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth")
public class AuthController {
 private final AuthService service;
 private final PasswordResetService passwordResetService;
 public AuthController(AuthService service,PasswordResetService passwordResetService){this.service=service;this.passwordResetService=passwordResetService;}
 @PostMapping("/register") public AuthResponse register(@Valid @RequestBody RegisterRequest r){return service.register(r);}
 @PostMapping("/login") public AuthResponse login(@Valid @RequestBody LoginRequest r){return service.login(r);}
 @PostMapping("/forgot-password") public java.util.Map<String,String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest r){passwordResetService.requestReset(r);return java.util.Map.of("message","If an eligible account exists, a password reset link will be sent.");}
 @PostMapping("/reset-password") public java.util.Map<String,String> resetPassword(@Valid @RequestBody ResetPasswordRequest r){passwordResetService.resetPassword(r);return java.util.Map.of("message","Your password has been reset. You can now sign in.");}
 @PutMapping("/change-password") public java.util.Map<String,String> changePassword(Authentication a,@Valid @RequestBody ChangePasswordRequest r){passwordResetService.changePassword(a.getName(),r);return java.util.Map.of("message","Your password has been updated.");}
 @GetMapping("/me") public UserResponse me(Authentication a){return UserResponse.from(service.current(a.getName()));}
 @PutMapping("/me") public UserResponse updateMe(Authentication a,@Valid @RequestBody UpdateProfileRequest r){return UserResponse.from(service.updateProfile(a.getName(),r));}
}
