package com.nexuspc.cart;
import org.springframework.data.jpa.repository.*;
import java.util.*;
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUserEmailIgnoreCase(String email);
}
