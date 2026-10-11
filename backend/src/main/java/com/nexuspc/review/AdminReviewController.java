package com.nexuspc.review;
import com.nexuspc.review.dto.*; import jakarta.validation.constraints.NotBlank; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/admin/reviews") @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')") public class AdminReviewController {
 private final ReviewService service; public AdminReviewController(ReviewService s){service=s;}
 @GetMapping public List<ReviewResponse> list(){return service.adminList();}
 public record ModerationRequest(@NotBlank String status){}
 @PutMapping("/{id}") public ReviewResponse moderate(@PathVariable Long id,@RequestBody ModerationRequest r){return service.moderate(id,r.status());}
}
