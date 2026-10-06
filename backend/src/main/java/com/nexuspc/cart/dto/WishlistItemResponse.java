package com.nexuspc.cart.dto;
import java.math.BigDecimal;
public record WishlistItemResponse(Long id, Long productId, String slug, String name, String brand,
                                   String image, BigDecimal price, BigDecimal originalPrice, int stockCount,
                                   String categoryName) {}
