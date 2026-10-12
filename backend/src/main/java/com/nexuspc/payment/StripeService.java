package com.nexuspc.payment;

import com.nexuspc.order.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@Service
public class StripeService {
    private final RestClient client;
    private final StripeProperties properties;

    public StripeService(RestClient.Builder builder, StripeProperties properties) {
        this.properties = properties;
        this.client = builder.baseUrl("https://api.stripe.com/v1").build();
    }

    public boolean isEnabled() {
        return properties.enabled();
    }

    public String frontendUrl() {
        return properties.frontendUrl();
    }

    /** Order totals are stored in BDT; Stripe is charged in USD cents at the configured rate. */
    public long toUsdCents(BigDecimal totalBdt) {
        return totalBdt.multiply(BigDecimal.valueOf(100))
                .divide(properties.bdtPerUsd(), 0, RoundingMode.HALF_UP).longValueExact();
    }

    public PaymentStart start(Order order) {
        if (!properties.enabled()) throw new IllegalStateException("Stripe payment is not enabled");
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("mode", "payment");
        form.add("client_reference_id", order.getOrderNumber());
        form.add("customer_email", order.getCustomerEmail());
        form.add("success_url", properties.callbackUrl() + "?session_id={CHECKOUT_SESSION_ID}");
        form.add("cancel_url", UrlParts.frontendResult(properties.frontendUrl(), order.getOrderNumber(), "failed"));
        form.add("line_items[0][quantity]", "1");
        form.add("line_items[0][price_data][currency]", "usd");
        form.add("line_items[0][price_data][unit_amount]", String.valueOf(toUsdCents(order.getTotal())));
        form.add("line_items[0][price_data][product_data][name]", "NexusPC order " + order.getOrderNumber());
        Map<?, ?> response = client.post().uri("/checkout/sessions")
                .headers(h -> h.setBearerAuth(properties.secretKey()))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve().body(Map.class);
        if (response == null || response.get("id") == null || response.get("url") == null) {
            throw new IllegalStateException("Unable to initialize Stripe payment");
        }
        return new PaymentStart(String.valueOf(response.get("id")), String.valueOf(response.get("url")));
    }

    public boolean isPaid(String sessionId, BigDecimal expectedTotalBdt, String expectedOrderNumber) {
        Map<?, ?> response = client.get().uri("/checkout/sessions/{id}", sessionId)
                .headers(h -> h.setBearerAuth(properties.secretKey()))
                .retrieve().body(Map.class);
        if (response == null || !"paid".equals(String.valueOf(response.get("payment_status")))) return false;
        return expectedOrderNumber.equals(String.valueOf(response.get("client_reference_id")))
                && "usd".equalsIgnoreCase(String.valueOf(response.get("currency")))
                && String.valueOf(toUsdCents(expectedTotalBdt)).equals(String.valueOf(response.get("amount_total")));
    }

    public record PaymentStart(String sessionId, String paymentUrl) {
    }
}
