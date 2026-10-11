package com.nexuspc.coupon;

import com.nexuspc.coupon.dto.PromoCodeRequest;
import com.nexuspc.coupon.dto.PromoCodeResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/promo-codes")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminPromoCodeController {
    private final CouponService coupons;
    public AdminPromoCodeController(CouponService coupons) { this.coupons = coupons; }
    @GetMapping public List<PromoCodeResponse> list() { return coupons.adminList(); }
    @PostMapping public PromoCodeResponse create(@Valid @RequestBody PromoCodeRequest request) { return coupons.create(request); }
    @PutMapping("/{id}") public PromoCodeResponse update(@PathVariable Long id, @Valid @RequestBody PromoCodeRequest request) { return coupons.update(id, request); }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { coupons.delete(id); }
}
