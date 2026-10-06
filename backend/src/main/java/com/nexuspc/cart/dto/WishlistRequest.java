package com.nexuspc.cart.dto;
import jakarta.validation.constraints.NotNull;
public record WishlistRequest(@NotNull Long productId) {}
