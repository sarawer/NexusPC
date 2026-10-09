package com.nexuspc.order;
import com.nexuspc.user.User;
import jakarta.persistence.*;
import java.math.BigDecimal; import java.time.Instant; import java.util.*;
@Entity @Table(name="orders") public class Order {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,unique=true) private String orderNumber;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) private User user;
 @OneToMany(mappedBy="order",cascade=CascadeType.ALL,orphanRemoval=true) private List<OrderItem> items=new ArrayList<>();
 @Column(nullable=false) private String customerName; @Column(nullable=false) private String customerEmail; private String customerPhone;
 @Column(nullable=false) private String shippingName,shippingEmail,shippingPhone,division,district,area,shippingAddress;
 @Column(nullable=false) private String deliveryMethod,paymentMethod,paymentStatus="pending",status="pending";
 private String bkashPaymentId;
 @Column(nullable=false,precision=15,scale=2) private BigDecimal subtotal,discount,deliveryCharge,total;
 private String couponCode,notes; @Column(nullable=false) private Instant createdAt; @Column(nullable=false) private Instant updatedAt;
 protected Order(){}
 public Order(String no,User u,String n,String e,String p,String sn,String se,String sp,String div,String dis,String ar,String addr,String delivery,String payment,BigDecimal sub,BigDecimal discount,BigDecimal charge,BigDecimal total,String coupon,String notes){orderNumber=no;user=u;customerName=n;customerEmail=e;customerPhone=p;shippingName=sn;shippingEmail=se;shippingPhone=sp;division=div;district=dis;area=ar;shippingAddress=addr;deliveryMethod=delivery;paymentMethod=payment;subtotal=sub;this.discount=discount;deliveryCharge=charge;this.total=total;couponCode=coupon;this.notes=notes;}
 @PrePersist void create(){createdAt=updatedAt=Instant.now();} @PreUpdate void update(){updatedAt=Instant.now();}
 public Long getId(){return id;} public String getOrderNumber(){return orderNumber;} public User getUser(){return user;} public List<OrderItem> getItems(){return items;}
 public String getCustomerName(){return customerName;} public String getCustomerEmail(){return customerEmail;} public String getCustomerPhone(){return customerPhone;} public String getShippingName(){return shippingName;} public String getShippingEmail(){return shippingEmail;} public String getShippingPhone(){return shippingPhone;} public String getDivision(){return division;} public String getDistrict(){return district;} public String getArea(){return area;} public String getShippingAddress(){return shippingAddress;} public String getDeliveryMethod(){return deliveryMethod;} public String getPaymentMethod(){return paymentMethod;} public String getPaymentStatus(){return paymentStatus;} public String getStatus(){return status;} public BigDecimal getSubtotal(){return subtotal;} public BigDecimal getDiscount(){return discount;} public BigDecimal getDeliveryCharge(){return deliveryCharge;} public BigDecimal getTotal(){return total;} public String getCouponCode(){return couponCode;} public String getNotes(){return notes;} public Instant getCreatedAt(){return createdAt;} public Instant getUpdatedAt(){return updatedAt;}
 public String getBkashPaymentId(){return bkashPaymentId;} public void setBkashPaymentId(String id){bkashPaymentId=id;} public void setPaymentStatus(String s){paymentStatus=s;}
 public void setStatus(String s){status=s;} public void addItem(OrderItem i){items.add(i);}
 public void setTotals(BigDecimal sub, BigDecimal total){subtotal=sub; this.total=total;}
}
