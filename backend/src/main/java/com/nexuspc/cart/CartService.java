package com.nexuspc.cart;

import com.nexuspc.auth.AuthService;
import com.nexuspc.cart.dto.*;
import com.nexuspc.catalog.product.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.*;
import java.util.*;

@Service
public class CartService {
    private final CartRepository carts; private final CartItemRepository items;
    private final ProductRepository products; private final AuthService auth;
    public CartService(CartRepository c, CartItemRepository i, ProductRepository p, AuthService a) {
        carts=c; items=i; products=p; auth=a;
    }
    @Transactional(readOnly=true)
    public CartResponse get(String email) {
        return carts.findByUserEmailIgnoreCase(email).map(this::response)
                .orElse(new CartResponse(List.of(), BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, null));
    }
    @Transactional
    public CartResponse add(String email, CartItemRequest request) {
        Product product = product(request.productId());
        Cart cart = cart(email);
        CartItem item = items.findByCartIdAndProductId(cart.getId(), product.getId()).orElse(null);
        int quantity = request.quantity() + (item == null ? 0 : item.getQuantity());
        validateStock(product, quantity);
        if (item == null) {
            CartItem created = new CartItem(cart, product, request.quantity());
            cart.getItems().add(created);
            items.save(created);
        } else item.setQuantity(quantity);
        return response(cart);
    }
    @Transactional
    public CartResponse update(String email, Long productId, CartItemRequest request) {
        if (!productId.equals(request.productId())) throw new IllegalArgumentException("Product id does not match path");
        Cart cart = cart(email);
        CartItem item = items.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new NoSuchElementException("Cart item not found"));
        validateStock(item.getProduct(), request.quantity());
        item.setQuantity(request.quantity());
        return response(cart);
    }
    @Transactional
    public CartResponse remove(String email, Long productId) {
        Cart cart = cart(email);
        CartItem item = items.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new NoSuchElementException("Cart item not found"));
        items.delete(item);
        return response(cart);
    }
    @Transactional
    public CartResponse clear(String email) {
        Cart cart = cart(email); cart.getItems().clear(); return response(cart);
    }
    private Cart cart(String email) {
        return carts.findByUserEmailIgnoreCase(email).orElseGet(() -> carts.save(new Cart(auth.current(email))));
    }
    private Product product(Long id) { return products.findById(id).orElseThrow(() -> new NoSuchElementException("Product not found")); }
    private void validateStock(Product p, int quantity) {
        if (p.getStockCount() <= 0 || quantity > p.getStockCount()) throw new IllegalArgumentException("Insufficient stock for " + p.getName());
    }
    private CartResponse response(Cart cart) {
        List<CartItemResponse> result = cart.getItems().stream().map(this::item).toList();
        BigDecimal subtotal = result.stream().map(i -> i.price().multiply(BigDecimal.valueOf(i.quantity()))).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal regular = result.stream().map(i -> (i.originalPrice() == null ? i.price() : i.originalPrice()).multiply(BigDecimal.valueOf(i.quantity()))).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal discount = regular.subtract(subtotal).max(BigDecimal.ZERO);
        return new CartResponse(result, subtotal, discount, subtotal, null);
    }
    private CartItemResponse item(CartItem i) {
        Product p=i.getProduct();
        String image=p.getImages().isEmpty()?null:p.getImages().get(0).getUrl();
        return new CartItemResponse(i.getId(),p.getId(),p.getSlug(),p.getName(),p.getBrand(),image,p.getPrice(),p.getOriginalPrice(),i.getQuantity(),p.getStockCount(),p.getCategory().getName());
    }
}
