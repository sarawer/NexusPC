package com.nexuspc.review;
import com.nexuspc.review.dto.*; import jakarta.validation.Valid; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api") public class ReviewController {
 private final ReviewService service; public ReviewController(ReviewService s){service=s;}
 @GetMapping("/products/{slug}/reviews") public List<ReviewResponse> list(@PathVariable String slug){return service.list(slug);}
 @PostMapping("/products/{slug}/reviews") @PreAuthorize("isAuthenticated()") public ReviewResponse create(Authentication a,@PathVariable String slug,@Valid @RequestBody ReviewRequest r){return service.create(a.getName(),slug,r);}
 @PutMapping("/reviews/{id}") @PreAuthorize("isAuthenticated()") public ReviewResponse update(Authentication a,@PathVariable Long id,@Valid @RequestBody ReviewRequest r){return service.update(a.getName(),id,r);}
 @DeleteMapping("/reviews/{id}") @PreAuthorize("isAuthenticated()") public void delete(Authentication a,@PathVariable Long id){service.delete(a.getName(),id);}
}
