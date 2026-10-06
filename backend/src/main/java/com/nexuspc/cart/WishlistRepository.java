package com.nexuspc.cart;
import org.springframework.data.jpa.repository.*;
import java.util.*;
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserEmailIgnoreCaseOrderByIdDesc(String email);
    Optional<Wishlist> findByUserEmailIgnoreCaseAndProductId(String email, Long productId);
}
