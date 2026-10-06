package com.nexuspc.auth;
import com.nexuspc.auth.dto.*;
import com.nexuspc.user.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
@Service public class AuthService {
 private final UserRepository users; private final PasswordEncoder encoder; private final AuthenticationManager auth; private final JwtService jwt;
 public AuthService(UserRepository u,PasswordEncoder e,AuthenticationManager a,JwtService j){users=u;encoder=e;auth=a;jwt=j;}
 public AuthResponse register(RegisterRequest r){
  String email=r.email().trim().toLowerCase();
  if(users.existsByEmailIgnoreCase(email)) throw new IllegalArgumentException("Email is already registered");
  User user=users.save(new User(r.name().trim(),email,r.phone(),encoder.encode(r.password()),UserRole.CUSTOMER));
  UserDetails details=org.springframework.security.core.userdetails.User.withUsername(user.getEmail()).password(user.getPassword()).roles(user.getRole().name()).build();
  return new AuthResponse(jwt.generateToken(details),UserResponse.from(user));
 }
 public AuthResponse login(LoginRequest r){
  String email=r.email().trim().toLowerCase();
  auth.authenticate(new UsernamePasswordAuthenticationToken(email,r.password()));
  User user=users.findByEmailIgnoreCase(email).orElseThrow();
  UserDetails details=org.springframework.security.core.userdetails.User.withUsername(user.getEmail()).password(user.getPassword()).roles(user.getRole().name()).build();
  return new AuthResponse(jwt.generateToken(details),UserResponse.from(user));
 }
 public User current(String email){return users.findByEmailIgnoreCase(email).orElseThrow();}
 public User updateProfile(String email, UpdateProfileRequest request) {
  User user = current(email);
  user.updateProfile(request.name().trim(), request.phone() == null ? null : request.phone().trim());
  return users.save(user);
 }
}
