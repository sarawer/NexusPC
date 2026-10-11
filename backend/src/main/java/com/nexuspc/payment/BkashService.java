package com.nexuspc.payment;

import com.nexuspc.order.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class BkashService {
    private final RestClient client;
    private final BkashProperties properties;

    public BkashService(RestClient.Builder builder, BkashProperties properties) {
        this.properties = properties;
        this.client = builder.baseUrl(properties.baseUrl()).build();
    }

    public PaymentStart start(Order order) {
        if (!properties.enabled()) throw new IllegalStateException("bKash payment is not enabled");
        String token = token();
        Map<?, ?> response = client.post().uri("/tokenized/checkout/create")
                .headers(headers -> headers.setBearerAuth(token))
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "mode", "0011",
                        "payerReference", order.getCustomerPhone(),
                        "callbackURL", properties.callbackUrl(),
                        "amount", order.getTotal().setScale(2).toPlainString(),
                        "currency", "BDT",
                        "intent", "sale",
                        "merchantInvoiceNumber", order.getOrderNumber()))
                .retrieve().body(Map.class);
        if (response == null || !"0000".equals(String.valueOf(response.get("statusCode")))
                || response.get("paymentID") == null || response.get("bkashURL") == null
                || String.valueOf(response.get("paymentID")).isBlank()
                || String.valueOf(response.get("bkashURL")).isBlank()) {
            throw new IllegalStateException("Unable to initialize bKash payment");
        }

        return new PaymentStart(String.valueOf(response.get("paymentID")), String.valueOf(response.get("bkashURL")));
    }

    public boolean isEnabled() {
        return properties.enabled();
    }

    public boolean execute(String paymentId, BigDecimal expectedAmount, String expectedInvoice) {
        String token = token();
        Map<?, ?> response = client.post().uri("/tokenized/checkout/execute/{paymentId}", paymentId)
                .headers(headers -> headers.setBearerAuth(token))
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("paymentID", paymentId))
                .retrieve().body(Map.class);
        if (response == null || !"0000".equals(String.valueOf(response.get("statusCode")))
                || !"Completed".equalsIgnoreCase(String.valueOf(response.get("transactionStatus")))) {
            return false;
        }
        try {
            BigDecimal paidAmount = new BigDecimal(String.valueOf(response.get("amount")));
            return paidAmount.compareTo(expectedAmount) == 0
                    && "BDT".equalsIgnoreCase(String.valueOf(response.get("currency")))
                    && expectedInvoice.equals(String.valueOf(response.get("merchantInvoiceNumber")));
        } catch (RuntimeException invalidResponse) {
            return false;
        }
    }

    public String frontendUrl() {
        return properties.frontendUrl();
    }

    private String token() {
        Map<?, ?> response = client.post().uri("/tokenized/checkout/token/grant")
                .headers(headers -> {
                    headers.set("username", properties.username());
                    headers.set("password", properties.password());
                })
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("app_key", properties.appKey(), "app_secret", properties.appSecret()))
                .retrieve().body(Map.class);
        if (response == null || response.get("id_token") == null) {
            throw new IllegalStateException("Unable to authenticate with bKash");
        }
        return String.valueOf(response.get("id_token"));
    }

    public record PaymentStart(String paymentId, String paymentUrl) {
    }
}
