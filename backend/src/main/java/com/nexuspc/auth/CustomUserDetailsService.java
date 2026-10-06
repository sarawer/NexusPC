package com.nexuspc.auth;
import com.nexuspc.user.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
@Service public class CustomUserDetailsService implements UserDetailsService{
 private final UserRepository repository;
 public CustomUserDetailsService(UserRepository repository){this.repository=repository;}
 @Override public UserDetails loadUserByUsername(String username){return repository.findByEmailIgnoreCase(username)
  .map(u->User.withUsername(u.getEmail()).password(u.getPassword()).roles(u.getRole().name()).build())
  .orElseThrow(()->new UsernameNotFoundException("User not found"));}
}
