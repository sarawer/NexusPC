package com.nexuspc.payment;

import com.nexuspc.order.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments/stripe")
public class StripeController {
    private final OrderService orders;

    public StripeController(OrderService orders) {
        this.orders = orders;
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> callback(@RequestParam("session_id") String sessionId) {
        String result;
        try {
            result = orders.completeStripePayment(sessionId) ? "success" : "pending";
        } catch (RuntimeException verificationUnavailable) {
            // An API error is not proof that payment failed; leave the order pending.
            result = "pending";
        }
        return ResponseEntity.status(302).header("Location", orders.stripeRedirect(sessionId, result)).build();
    }
}
