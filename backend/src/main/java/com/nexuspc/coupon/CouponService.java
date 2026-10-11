package com.nexuspc.coupon;

import com.nexuspc.coupon.dto.CouponValidationResponse;
import com.nexuspc.coupon.dto.PromoCodeRequest;
import com.nexuspc.coupon.dto.PromoCodeResponse;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CouponService {
    private final PromoCodeRepository promos;
    public CouponService(PromoCodeRepository promos) { this.promos = promos; }

    @Transactional(readOnly = true)
    public CouponValidationResponse validate(String rawCode, BigDecimal subtotal) {
        String code = normalize(rawCode);
        PromoCode promo = promos.findByCode(code).orElseThrow(() -> new IllegalArgumentException("Coupon code is not valid"));
        Instant now = Instant.now();
        if (now.isBefore(promo.getStartsAt()) || now.isAfter(promo.getEndsAt())) throw new IllegalArgumentException("This coupon is not currently valid");
        if (subtotal.compareTo(promo.getMinimumOrderAmount()) < 0) throw new IllegalArgumentException("Minimum order amount for this coupon is ৳" + promo.getMinimumOrderAmount().stripTrailingZeros().toPlainString());
        BigDecimal discount = "PERCENTAGE".equals(promo.getDiscountType())
                ? subtotal.multiply(promo.getDiscountValue()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP)
                : promo.getDiscountValue();
        return new CouponValidationResponse(code, discount.min(subtotal).max(BigDecimal.ZERO));
    }

    @Transactional(readOnly = true)
    public List<PromoCodeResponse> adminList() { return promos.findAll().stream().map(PromoCodeResponse::from).toList(); }

    @Transactional
    public PromoCodeResponse create(PromoCodeRequest request) {
        String code = normalize(request.code());
        validateFields(request);
        if (promos.findByCode(code).isPresent()) throw new IllegalArgumentException("A promo code with this code already exists");
        return PromoCodeResponse.from(promos.save(new PromoCode(code, request.discountType(), request.discountValue(), request.minimumOrderAmount(), request.startsAt(), request.endsAt())));
    }

    @Transactional
    public PromoCodeResponse update(Long id, PromoCodeRequest request) {
        String code = normalize(request.code());
        validateFields(request);
        PromoCode promo = promos.findById(id).orElseThrow(() -> new java.util.NoSuchElementException("Promo code not found"));
        if (promos.existsByCodeAndIdNot(code, id)) throw new IllegalArgumentException("A promo code with this code already exists");
        promo.update(code, request.discountType(), request.discountValue(), request.minimumOrderAmount(), request.startsAt(), request.endsAt());
        return PromoCodeResponse.from(promo);
    }

    @Transactional
    public void delete(Long id) {
        PromoCode promo = promos.findById(id).orElseThrow(() -> new java.util.NoSuchElementException("Promo code not found"));
        promos.delete(promo);
    }

    public String normalize(String rawCode) { return rawCode == null ? "" : rawCode.trim().toUpperCase(Locale.ROOT); }

    private void validateFields(PromoCodeRequest request) {
        if ("PERCENTAGE".equals(request.discountType()) && request.discountValue().compareTo(BigDecimal.valueOf(100)) > 0)
            throw new IllegalArgumentException("Percentage discount cannot exceed 100%");
        if (!request.endsAt().isAfter(request.startsAt())) throw new IllegalArgumentException("End time must be after start time");
    }
}
