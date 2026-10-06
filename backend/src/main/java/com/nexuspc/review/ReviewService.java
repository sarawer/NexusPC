package com.nexuspc.review;
import com.nexuspc.catalog.product.*; import com.nexuspc.order.OrderRepository; import com.nexuspc.review.dto.*; import com.nexuspc.user.*; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional; import java.util.*;
@Service public class ReviewService {
 private final ReviewRepository reviews; private final ProductRepository products; private final UserRepository users; private final OrderRepository orders;
 public ReviewService(ReviewRepository r,ProductRepository p,UserRepository u,OrderRepository o){reviews=r;products=p;users=u;orders=o;}
 public List<ReviewResponse> list(String slug){return reviews.findByProductSlugAndStatusOrderByCreatedAtDesc(slug,"approved").stream().map(this::out).toList();}
 @Transactional public ReviewResponse create(String email,String slug,ReviewRequest r){if(reviews.existsByProductIdAndUserEmailIgnoreCase(product(slug).getId(),email))throw new IllegalArgumentException("You have already reviewed this product"); User u=users.findByEmailIgnoreCase(email).orElseThrow(); Product p=product(slug); Review x=new Review(p,u,r.rating(),r.comment(),orders.existsPurchased(email,p.getId())); return out(reviews.save(x));}
 @Transactional public ReviewResponse update(String email,Long id,ReviewRequest r){Review x=reviews.findByIdAndUserEmailIgnoreCase(id,email).orElseThrow(()->new NoSuchElementException("Review not found"));x.update(r.rating(),r.comment());x.moderate("pending");refresh(x.getProduct());return out(x);}
 @Transactional public void delete(String email,Long id){Review x=reviews.findByIdAndUserEmailIgnoreCase(id,email).orElseThrow(()->new NoSuchElementException("Review not found"));Product p=x.getProduct();reviews.delete(x);refresh(p);}
 public List<ReviewResponse> adminList(){return reviews.findAllByOrderByCreatedAtDesc().stream().map(this::out).toList();}
 @Transactional public ReviewResponse moderate(Long id,String status){if(!Set.of("approved","rejected","pending").contains(status))throw new IllegalArgumentException("Invalid review status");Review x=reviews.findById(id).orElseThrow(()->new NoSuchElementException("Review not found"));x.moderate(status);refresh(x.getProduct());return out(x);}
 private Product product(String slug){return products.findBySlug(slug).orElseThrow(()->new NoSuchElementException("Product not found"));}
 private void refresh(Product p){var all=reviews.findByProductIdAndStatus(p.getId(),"approved");double avg=all.stream().mapToInt(Review::getRating).average().orElse(0);p.updateReviewSummary(avg,all.size());}
 private ReviewResponse out(Review r){return new ReviewResponse(r.getId(),r.getProduct().getId(),r.getProduct().getName(),r.getUser().getName(),r.getRating(),r.getComment(),r.getStatus(),r.isVerified(),r.getCreatedAt());}
}
