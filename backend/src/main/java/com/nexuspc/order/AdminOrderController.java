package com.nexuspc.order;
import com.nexuspc.order.dto.*; import jakarta.validation.Valid; import jakarta.validation.constraints.NotBlank; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.validation.annotation.Validated; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/admin/orders") @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')") @Validated public class AdminOrderController {
 private final OrderService service; public AdminOrderController(OrderService s){service=s;}
 @GetMapping public List<OrderResponse> list(){return service.adminList();}
 public record StatusRequest(@NotBlank String status){}
 @PutMapping("/{id}/status") public OrderResponse status(@PathVariable Long id,@Valid @RequestBody StatusRequest r){return service.updateStatus(id,r.status());}
}
