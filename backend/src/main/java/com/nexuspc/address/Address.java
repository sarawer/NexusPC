package com.nexuspc.address;

import com.nexuspc.user.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name="addresses")
public class Address {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="user_id",nullable=false) private User user;
 @Column(nullable=false,length=120) private String name;
 @Column(nullable=false,length=254) private String email;
 @Column(nullable=false,length=30) private String phone;
 @Column(nullable=false,length=80) private String division;
 @Column(nullable=false,length=80) private String district;
 @Column(nullable=false,length=120) private String area;
 @Column(nullable=false,length=500) private String address;
 @Column(nullable=false) private boolean defaultAddress;
 @Column(nullable=false) private Instant createdAt;
 protected Address() {}
 public Address(User user,String name,String email,String phone,String division,String district,String area,String address,boolean def) {
  this.user=user; this.name=name; this.email=email; this.phone=phone; this.division=division; this.district=district; this.area=area; this.address=address; this.defaultAddress=def;
 }
 @PrePersist void create(){createdAt=Instant.now();}
 public Long getId(){return id;} public User getUser(){return user;} public String getName(){return name;} public String getEmail(){return email;}
 public String getPhone(){return phone;} public String getDivision(){return division;} public String getDistrict(){return district;} public String getArea(){return area;}
 public String getAddress(){return address;} public boolean isDefaultAddress(){return defaultAddress;}
 public void update(String n,String e,String p,String v,String d,String a,String ad){name=n;email=e;phone=p;division=v;district=d;area=a;address=ad;}
 public void setDefaultAddress(boolean value){defaultAddress=value;}
}
