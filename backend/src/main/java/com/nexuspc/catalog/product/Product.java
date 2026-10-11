package com.nexuspc.catalog.product;

import com.nexuspc.catalog.category.Category;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Entity
@Table(name = "products", uniqueConstraints = {@UniqueConstraint(name = "uk_product_slug", columnNames = "slug"), @UniqueConstraint(name = "uk_product_sku", columnNames = "sku")})
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 180)
    private String slug;
    @Column(nullable = false, length = 250)
    private String name;
    @Column(length = 120)
    private String brand;
    @Column(nullable = false, length = 80)
    private String sku;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Category category;
    @Column(length = 3000)
    private String description;
    @Column(length = 1000)
    private String shortDescription;
    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    private List<ProductImage> images = new ArrayList<>();
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;
    @Column(precision = 15, scale = 2)
    private BigDecimal originalPrice;
    @Column(nullable = false)
    private int stockCount;
    @Column(nullable = false)
    private double rating;
    @Column(nullable = false)
    private int reviewCount;
    @Column(length = 120)
    private String warranty;
    @ElementCollection
    @CollectionTable(name = "product_specifications", joinColumns = @JoinColumn(name = "product_id"))
    @MapKeyColumn(name = "specification_name")
    @Column(name = "specification_value", length = 1000)
    private Map<String, String> specifications = new LinkedHashMap<>();
    @ElementCollection
    private Set<String> tags = new LinkedHashSet<>();
    @Column(nullable = false)
    private boolean featured;
    @Column(nullable = false)
    private boolean bestseller;
    @Column(nullable = false)
    private boolean newProduct;
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @Column(nullable = false)
    private Instant updatedAt;

    protected Product() {
    }

    public Product(String slug, String name, String brand, String sku, Category category, String description, String shortDescription, List<ProductImage> images, BigDecimal price, BigDecimal originalPrice, int stockCount, double rating, int reviewCount, String warranty, Map<String, String> specifications, Set<String> tags, boolean featured, boolean bestseller, boolean newProduct) {
        this.slug = slug;
        this.name = name;
        this.brand = brand;
        this.sku = sku;
        this.category = category;
        this.description = description;
        this.shortDescription = shortDescription;
        this.images = images == null ? new ArrayList<>() : images;
        this.price = price;
        this.originalPrice = originalPrice;
        this.stockCount = stockCount;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.warranty = warranty;
        this.specifications = specifications == null ? new LinkedHashMap<>() : specifications;
        this.tags = tags == null ? new LinkedHashSet<>() : tags;
        this.featured = featured;
        this.bestseller = bestseller;
        this.newProduct = newProduct;
    }

    @PrePersist
    void create() {
        createdAt = Instant.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    void updateTime() {
        updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getSlug() {
        return slug;
    }

    public String getName() {
        return name;
    }

    public String getBrand() {
        return brand;
    }

    public String getSku() {
        return sku;
    }

    public Category getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public List<ProductImage> getImages() {
        return images;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }

    public int getStockCount() {
        return stockCount;
    }
    public void decreaseStock(int quantity) {
        if (quantity <= 0 || quantity > stockCount) throw new IllegalArgumentException("Insufficient stock for " + name);
        stockCount -= quantity;
    }
    public void setStockCount(int stockCount) {
        if (stockCount < 0) throw new IllegalArgumentException("Stock cannot be negative");
        this.stockCount = stockCount;
    }

    public void restoreStock(int quantity) {
        if (quantity <= 0) throw new IllegalArgumentException("Quantity must be positive");
        this.stockCount += quantity;
    }

    public double getRating() {
        return rating;
    }

    public int getReviewCount() {
        return reviewCount;
    }
    public void updateReviewSummary(double rating, int reviewCount) {
        this.rating = rating;
        this.reviewCount = reviewCount;
    }

    public String getWarranty() {
        return warranty;
    }

    public Map<String, String> getSpecifications() {
        return specifications;
    }

    public Set<String> getTags() {
        return tags;
    }

    public boolean isFeatured() {
        return featured;
    }

    public boolean isBestseller() {
        return bestseller;
    }

    public boolean isNewProduct() {
        return newProduct;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void update(String slug, String name, String brand, String sku, Category category, String description, String shortDescription, List<ProductImage> images, BigDecimal price, BigDecimal originalPrice, int stockCount, double rating, int reviewCount, String warranty, Map<String, String> specifications, Set<String> tags, boolean featured, boolean bestseller, boolean newProduct) {
        this.slug = slug;
        this.name = name;
        this.brand = brand;
        this.sku = sku;
        this.category = category;
        this.description = description;
        this.shortDescription = shortDescription;
        this.images = images == null ? new ArrayList<>() : images;
        this.price = price;
        this.originalPrice = originalPrice;
        this.stockCount = stockCount;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.warranty = warranty;
        this.specifications = specifications == null ? new LinkedHashMap<>() : specifications;
        this.tags = tags == null ? new LinkedHashSet<>() : tags;
        this.featured = featured;
        this.bestseller = bestseller;
        this.newProduct = newProduct;
    }
}
