package com.nexuspc.coupon.dto;

import com.nexuspc.coupon.PromoCode;
import java.math.BigDecimal;
import java.time.Instant;

public record PromoCodeResponse(Long id, String code, String discountType, BigDecimal discountValue,
                                BigDecimal minimumOrderAmount, Instant startsAt, Instant endsAt) {
    public static PromoCodeResponse from(PromoCode promo) {
        return new PromoCodeResponse(promo.getId(), promo.getCode(), promo.getDiscountType(), promo.getDiscountValue(),
                promo.getMinimumOrderAmount(), promo.getStartsAt(), promo.getEndsAt());
    }
}
