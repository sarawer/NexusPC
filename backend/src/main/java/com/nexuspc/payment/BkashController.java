package com.nexuspc.payment;

import com.nexuspc.order.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments/bkash")
public class BkashController {
    private final OrderService orders;

    public BkashController(OrderService orders) {
        this.orders = orders;
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> callback(@RequestParam String paymentID, @RequestParam String status) {
        String result;
        if ("success".equalsIgnoreCase(status)) {
            try {
                result = orders.completeBkashPayment(paymentID) ? "success" : "pending";
            } catch (RuntimeException verificationUnavailable) {
                // A network/API error is not proof that a payment failed. Keep it pending for reconciliation.
                result = "pending";
            }
        } else {
            // Callback query parameters are not proof of payment failure. Keep the order
            // pending until the provider can confirm its state through a trusted API call.
            result = "failure".equalsIgnoreCase(status) || "cancel".equalsIgnoreCase(status)
                    || "cancelled".equalsIgnoreCase(status) ? "failed" : "pending";
        }
        return ResponseEntity.status(302)
                .header("Location", orders.paymentRedirect(paymentID, result))
                .build();
    }
}
