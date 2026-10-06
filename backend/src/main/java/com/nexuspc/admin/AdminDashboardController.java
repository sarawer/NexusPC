package com.nexuspc.admin;
import com.nexuspc.catalog.product.ProductRepository; import com.nexuspc.order.*; import com.nexuspc.user.UserRepository; import com.nexuspc.review.ReviewRepository; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.web.bind.annotation.*; import java.math.*; import java.util.*;
@RestController @RequestMapping("/api/admin") @PreAuthorize("hasRole('ADMIN')") public class AdminDashboardController {
 private final ProductRepository products; private final OrderRepository orders; private final UserRepository users; private final ReviewRepository reviews;
 public AdminDashboardController(ProductRepository p,OrderRepository o,UserRepository u,ReviewRepository r){products=p;orders=o;users=u;reviews=r;}
 public record Dashboard(long customers,long products,long orders,long pendingReviews,BigDecimal revenue,long lowStockProducts){}
 @GetMapping("/dashboard") public Dashboard dashboard(){var os=orders.findAll();return new Dashboard(users.count(),products.count(),os.size(),reviews.findAllByOrderByCreatedAtDesc().stream().filter(r->"pending".equals(r.getStatus())).count(),os.stream().filter(o->!"cancelled".equals(o.getStatus())).map(Order::getTotal).reduce(BigDecimal.ZERO,BigDecimal::add),products.findAll().stream().filter(p->p.getStockCount()<10).count());}
}
