package com.nexuspc.review;
import org.springframework.data.jpa.repository.*; import java.util.*;
public interface ReviewRepository extends JpaRepository<Review,Long>{
 List<Review> findByProductSlugAndStatusOrderByCreatedAtDesc(String slug,String status);
 List<Review> findAllByOrderByCreatedAtDesc();
 Optional<Review> findByIdAndUserEmailIgnoreCase(Long id,String email);
 Optional<Review> findByProductIdAndUserEmailIgnoreCase(Long productId,String email);
 List<Review> findByProductIdAndStatus(Long productId,String status);
}
