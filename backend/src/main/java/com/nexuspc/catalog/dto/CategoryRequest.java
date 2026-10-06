package com.nexuspc.catalog.dto;
import jakarta.validation.constraints.*;
public record CategoryRequest(@NotBlank @Size(max=120) String name,@NotBlank @Pattern(regexp="[a-z0-9-]+") String slug,@Size(max=1000) String description,@Size(max=1000) String icon,@Size(max=1000) String image) {}
