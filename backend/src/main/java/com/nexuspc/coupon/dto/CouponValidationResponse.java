package com.nexuspc.coupon.dto;

import java.math.BigDecimal;

public record CouponValidationResponse(String code, BigDecimal discount) {}
