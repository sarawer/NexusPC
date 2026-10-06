package com.nexuspc.cart.dto;
import jakarta.validation.constraints.*;
public record CartItemRequest(@NotNull @Positive Long productId, @NotNull @Positive Integer quantity) {}
