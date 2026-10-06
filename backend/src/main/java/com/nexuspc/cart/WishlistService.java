package com.nexuspc.cart;

import com.nexuspc.auth.AuthService;
import com.nexuspc.cart.dto.*;
import com.nexuspc.catalog.product.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class WishlistService {
    private final WishlistRepository wishlists; private final ProductRepository products; private final AuthService auth;
    public WishlistService(WishlistRepository w, ProductRepository p, AuthService a) { wishlists=w; products=p; auth=a; }
    @Transactional(readOnly=true)
    public List<WishlistItemResponse> list(String email) { return wishlists.findByUserEmailIgnoreCaseOrderByIdDesc(email).stream().map(this::response).toList(); }
    @Transactional
    public List<WishlistItemResponse> add(String email, Long productId) {
        Product product=products.findById(productId).orElseThrow(() -> new NoSuchElementException("Product not found"));
        if (wishlists.findByUserEmailIgnoreCaseAndProductId(email, productId).isEmpty())
            wishlists.save(new Wishlist(auth.current(email), product));
        return list(email);
    }
    @Transactional
    public List<WishlistItemResponse> remove(String email, Long productId) {
        Wishlist w=wishlists.findByUserEmailIgnoreCaseAndProductId(email, productId)
                .orElseThrow(() -> new NoSuchElementException("Wishlist item not found"));
        wishlists.delete(w); return list(email);
    }
    private WishlistItemResponse response(Wishlist w) {
        Product p=w.getProduct(); String image=p.getImages().isEmpty()?null:p.getImages().get(0).getUrl();
        return new WishlistItemResponse(w.getId(),p.getId(),p.getSlug(),p.getName(),p.getBrand(),image,p.getPrice(),p.getOriginalPrice(),p.getStockCount(),p.getCategory().getName());
    }
}
