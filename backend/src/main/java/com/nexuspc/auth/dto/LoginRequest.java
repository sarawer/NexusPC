package com.nexuspc.auth.dto;
import jakarta.validation.constraints.*;
public record LoginRequest(@NotBlank @Email String email,@NotBlank String password){}
