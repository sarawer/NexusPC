package com.nexuspc.coupon;

import com.nexuspc.coupon.dto.CouponValidationResponse;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class CouponService {
    public CouponValidationResponse validate(String rawCode, BigDecimal subtotal) {
        String code = normalize(rawCode);
        BigDecimal discount = switch (code) {
            case "SAVE500" -> BigDecimal.valueOf(500);
            case "WELCOME200" -> BigDecimal.valueOf(200);
            case "NEXUS10" -> subtotal.multiply(new BigDecimal("0.10")).setScale(2, RoundingMode.HALF_UP);
            default -> throw new IllegalArgumentException("Coupon code is not valid");
        };
        return new CouponValidationResponse(code, discount.min(subtotal).max(BigDecimal.ZERO));
    }

    public String normalize(String rawCode) {
        return rawCode == null ? "" : rawCode.trim().toUpperCase(Locale.ROOT);
    }
}
