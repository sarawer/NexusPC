package com.nexuspc.cart;
import com.nexuspc.cart.dto.*;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/cart")
public class CartController {
    private final CartService service;
    public CartController(CartService s) { service=s; }
    @GetMapping public CartResponse get(Authentication a) { return service.get(a.getName()); }
    @GetMapping("/items") public CartResponse getItems(Authentication a) { return service.get(a.getName()); }
    @PostMapping("/items") public CartResponse add(Authentication a,@Valid @RequestBody CartItemRequest r) { return service.add(a.getName(),r); }
    @PutMapping("/items/{productId}") public CartResponse update(Authentication a,@PathVariable Long productId,@Valid @RequestBody CartItemRequest r) { return service.update(a.getName(),productId,r); }
    @DeleteMapping("/items/{productId}") public CartResponse remove(Authentication a,@PathVariable Long productId) { return service.remove(a.getName(),productId); }
    @DeleteMapping("/clear") public CartResponse clear(Authentication a) { return service.clear(a.getName()); }
}
