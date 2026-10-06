package com.nexuspc.order.dto;
import jakarta.validation.constraints.*;
public record OrderItemRequest(@NotNull Long productId,@NotNull @Positive Integer quantity){}
