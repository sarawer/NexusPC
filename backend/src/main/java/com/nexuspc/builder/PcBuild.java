package com.nexuspc.builder;
import com.nexuspc.user.User; import jakarta.persistence.*; import java.time.Instant; import java.util.*;
@Entity @Table(name="pc_builds") public class PcBuild {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id; @ManyToOne(fetch=FetchType.LAZY,optional=false) User user;
 @Column(nullable=false,length=120) String name; @ElementCollection @CollectionTable(name="pc_build_components",joinColumns=@JoinColumn(name="build_id")) @MapKeyColumn(name="component_type") @Column(name="product_id",nullable=false) Map<String,Long> components=new LinkedHashMap<>();
 @Column(nullable=false) Instant createdAt; @Column(nullable=false) Instant updatedAt;
 protected PcBuild(){} PcBuild(User u,String n,Map<String,Long> c){user=u;name=n;components.putAll(c);}
 @PrePersist void create(){createdAt=updatedAt=Instant.now();}@PreUpdate void update(){updatedAt=Instant.now();}
 public Long getId(){return id;} public User getUser(){return user;} public String getName(){return name;} public Map<String,Long> getComponents(){return components;} public Instant getCreatedAt(){return createdAt;} public Instant getUpdatedAt(){return updatedAt;} public void rename(String n){name=n;}
}
