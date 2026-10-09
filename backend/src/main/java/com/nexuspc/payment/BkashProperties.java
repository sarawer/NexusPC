package com.nexuspc.payment;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "bkash")
public record BkashProperties(
        boolean enabled,
        String baseUrl,
        String username,
        String password,
        String appKey,
        String appSecret,
        String callbackUrl,
        String frontendUrl) {
}
