package com.nexuspc.builder.dto;
import jakarta.validation.constraints.*; import java.util.Map;
public record BuildRequest(@NotBlank @Size(max=120) String name,@NotEmpty Map<@NotBlank String,@NotNull Long> components){}
