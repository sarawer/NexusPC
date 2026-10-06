package com.nexuspc.cart;
import com.nexuspc.cart.dto.*;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/wishlist")
public class WishlistController {
    private final WishlistService service;
    public WishlistController(WishlistService s) { service=s; }
    @GetMapping public List<WishlistItemResponse> list(Authentication a) { return service.list(a.getName()); }
    @PostMapping public List<WishlistItemResponse> add(Authentication a,@Valid @RequestBody WishlistRequest r) { return service.add(a.getName(),r.productId()); }
    @PostMapping("/{productId}") public List<WishlistItemResponse> addPath(Authentication a,@PathVariable Long productId) { return service.add(a.getName(),productId); }
    @DeleteMapping("/{productId}") public List<WishlistItemResponse> remove(Authentication a,@PathVariable Long productId) { return service.remove(a.getName(),productId); }
}
