package com.nexuspc.coupon;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "promo_codes", uniqueConstraints = @UniqueConstraint(name = "uk_promo_code", columnNames = "code"))
public class PromoCode {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, unique = true, length = 40) private String code;
    @Column(nullable = false, length = 12) private String discountType;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal discountValue;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal minimumOrderAmount;
    @Column(nullable = false) private Instant startsAt;
    @Column(nullable = false) private Instant endsAt;

    protected PromoCode() {}
    public PromoCode(String code, String discountType, BigDecimal discountValue, BigDecimal minimumOrderAmount, Instant startsAt, Instant endsAt) {
        update(code, discountType, discountValue, minimumOrderAmount, startsAt, endsAt);
    }
    public void update(String code, String discountType, BigDecimal discountValue, BigDecimal minimumOrderAmount, Instant startsAt, Instant endsAt) {
        this.code = code; this.discountType = discountType; this.discountValue = discountValue;
        this.minimumOrderAmount = minimumOrderAmount; this.startsAt = startsAt; this.endsAt = endsAt;
    }
    public Long getId() { return id; }
    public String getCode() { return code; }
    public String getDiscountType() { return discountType; }
    public BigDecimal getDiscountValue() { return discountValue; }
    public BigDecimal getMinimumOrderAmount() { return minimumOrderAmount; }
    public Instant getStartsAt() { return startsAt; }
    public Instant getEndsAt() { return endsAt; }
}
