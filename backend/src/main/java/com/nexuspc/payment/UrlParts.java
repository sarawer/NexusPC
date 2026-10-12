package com.nexuspc.payment;

import org.springframework.web.util.UriComponentsBuilder;

final class UrlParts {
    private UrlParts() {
    }

    static String frontendResult(String frontendUrl, String orderNumber, String result) {
        return UriComponentsBuilder.fromUriString(frontendUrl)
                .path("/checkout/success").queryParam("orderId", orderNumber).queryParam("status", result)
                .build().encode().toUriString();
    }
}
