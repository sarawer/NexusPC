package com.nexuspc.config;
import com.nexuspc.auth.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
@Configuration @EnableMethodSecurity
public class SecurityConfig {
 @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}
 @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration c)throws Exception{return c.getAuthenticationManager();}
 @Bean SecurityFilterChain filterChain(HttpSecurity http,JwtAuthenticationFilter jwt)throws Exception{
  http.csrf(c->c.disable()).cors(c->{}).headers(h->h.frameOptions(f->f.sameOrigin()))
   .sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
   .authorizeHttpRequests(a->a.requestMatchers("/api/auth/register","/api/auth/login","/api/categories/**","/api/products/**","/api/payments/bkash/callback","/uploads/**","/error","/h2-console/**").permitAll().anyRequest().authenticated())
   .exceptionHandling(e->e.authenticationEntryPoint((req,res,ex)->res.sendError(HttpServletResponse.SC_UNAUTHORIZED))
     .accessDeniedHandler((req,res,ex)->res.sendError(HttpServletResponse.SC_FORBIDDEN)))
   .addFilterBefore(jwt,UsernamePasswordAuthenticationFilter.class);
  return http.build();
 }
}
