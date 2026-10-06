package com.nexuspc.cart;

import com.nexuspc.catalog.product.Product;
import com.nexuspc.user.User;
import jakarta.persistence.*;

@Entity
@Table(name = "wishlists", uniqueConstraints = @UniqueConstraint(name = "uk_wishlist_user_product", columnNames = {"user_id", "product_id"}))
public class Wishlist {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id", nullable = false) private User user;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "product_id", nullable = false) private Product product;
    protected Wishlist() {}
    public Wishlist(User user, Product product) { this.user = user; this.product = product; }
    public Long getId() { return id; }
    public Product getProduct() { return product; }
}
