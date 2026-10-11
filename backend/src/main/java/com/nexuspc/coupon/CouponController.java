package com.nexuspc.coupon;

import com.nexuspc.coupon.dto.CouponValidationRequest;
import com.nexuspc.coupon.dto.CouponValidationResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {
    private final CouponService coupons;

    public CouponController(CouponService coupons) { this.coupons = coupons; }

    @PostMapping("/validate")
    public CouponValidationResponse validate(@Valid @RequestBody CouponValidationRequest request) {
        return coupons.validate(request.code(), request.subtotal());
    }
}
