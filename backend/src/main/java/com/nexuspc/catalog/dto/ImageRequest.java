package com.nexuspc.catalog.dto;
import jakarta.validation.constraints.*;
public record ImageRequest(@NotBlank String url,@Size(max=500) String alt) {}
