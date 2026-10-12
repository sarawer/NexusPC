package com.nexuspc.payment;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.math.BigDecimal;

@ConfigurationProperties(prefix = "stripe")
public record StripeProperties(
        boolean enabled,
        String secretKey,
        String callbackUrl,
        String frontendUrl,
        BigDecimal bdtPerUsd) {
}
