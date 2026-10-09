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
        boolean paid = "success".equalsIgnoreCase(status) && orders.completeBkashPayment(paymentID);
        return ResponseEntity.status(302)
                .header("Location", orders.paymentRedirect(paymentID, paid))
                .build();
    }
}
