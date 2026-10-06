package com.nexuspc.auth;
import jakarta.servlet.*;import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.stereotype.Component;
import java.io.IOException;
@Component public class JwtAuthenticationFilter extends OncePerRequestFilter{
 private final JwtService jwtService;private final CustomUserDetailsService users;
 public JwtAuthenticationFilter(JwtService j,CustomUserDetailsService u){jwtService=j;users=u;}
 @Override protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{
  String h=req.getHeader("Authorization");
  if(h!=null&&h.startsWith("Bearer ")){try{String t=h.substring(7),name=jwtService.extractUsername(t);
   if(SecurityContextHolder.getContext().getAuthentication()==null){UserDetails d=users.loadUserByUsername(name);
    if(jwtService.isValid(t,d)){var a=new UsernamePasswordAuthenticationToken(d,null,d.getAuthorities());a.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));SecurityContextHolder.getContext().setAuthentication(a);}}
  }catch(RuntimeException ignored){}}
  chain.doFilter(req,res);
 }
}
