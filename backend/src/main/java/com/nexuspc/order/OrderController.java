package com.nexuspc.order;
import com.nexuspc.order.dto.*; import jakarta.validation.Valid; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/orders") public class OrderController {
 private final OrderService service; public OrderController(OrderService s){service=s;}
 @PostMapping public OrderResponse create(Authentication a,@Valid @RequestBody OrderRequest r){return service.create(a.getName(),r);}
 @GetMapping public List<OrderResponse> list(Authentication a){return service.list(a.getName());}
 @GetMapping("/{id}") public OrderResponse get(Authentication a,@PathVariable Long id){return service.get(a.getName(),id);}
 @PostMapping("/{id}/cancel") public OrderResponse cancel(Authentication a,@PathVariable Long id){return service.cancel(a.getName(),id);}
}
