package com.nexuspc.coupon.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;

public record PromoCodeRequest(
    @NotBlank @Size(min = 3, max = 40) @Pattern(regexp = "[A-Za-z0-9_-]+") String code,
    @NotBlank @Pattern(regexp = "FIXED|PERCENTAGE") String discountType,
    @NotNull @DecimalMin(value = "0.01") BigDecimal discountValue,
    @NotNull @DecimalMin(value = "0.00") BigDecimal minimumOrderAmount,
    @NotNull Instant startsAt,
    @NotNull Instant endsAt
) {}
