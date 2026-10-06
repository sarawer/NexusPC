package com.nexuspc.review;

import com.nexuspc.catalog.product.Product;
import com.nexuspc.user.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name="reviews", uniqueConstraints=@UniqueConstraint(name="uk_review_user_product", columnNames={"user_id","product_id"}))
public class Review {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) private Product product;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) private User user;
 @Column(nullable=false) private int rating;
 @Column(nullable=false,length=2000) private String comment;
 @Column(nullable=false,length=20) private String status="pending";
 @Column(nullable=false) private boolean verified;
 @Column(nullable=false,updatable=false) private Instant createdAt;
 private Instant updatedAt;
 protected Review(){}
 public Review(Product p,User u,int r,String c,boolean v){product=p;user=u;rating=r;comment=c;verified=v;}
 @PrePersist void create(){createdAt=updatedAt=Instant.now();} @PreUpdate void update(){updatedAt=Instant.now();}
 public Long getId(){return id;} public Product getProduct(){return product;} public User getUser(){return user;}
 public int getRating(){return rating;} public String getComment(){return comment;} public String getStatus(){return status;}
 public boolean isVerified(){return verified;} public Instant getCreatedAt(){return createdAt;} public Instant getUpdatedAt(){return updatedAt;}
 public void update(int r,String c){rating=r;comment=c;} public void moderate(String s){status=s;}
}
