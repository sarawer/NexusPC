package com.nexuspc.order;
import jakarta.persistence.*; import java.math.BigDecimal;
@Entity @Table(name="order_items") public class OrderItem {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @ManyToOne(fetch=FetchType.LAZY,optional=false) private Order order;
 @Column(nullable=false) private Long productId; @Column(nullable=false) private String name; private String brand,image; @Column(nullable=false,precision=15,scale=2) private BigDecimal price,subtotal; @Column(nullable=false) private int quantity;
 protected OrderItem(){} public OrderItem(Order o,Long id,String n,String b,String im,BigDecimal p,int q){order=o;productId=id;name=n;brand=b;image=im;price=p;quantity=q;subtotal=p.multiply(BigDecimal.valueOf(q));}
 public Long getProductId(){return productId;} public String getName(){return name;} public String getBrand(){return brand;} public String getImage(){return image;} public BigDecimal getPrice(){return price;} public int getQuantity(){return quantity;} public BigDecimal getSubtotal(){return subtotal;}
}
