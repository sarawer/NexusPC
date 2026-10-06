package com.nexuspc.order;
import com.nexuspc.address.*; import com.nexuspc.auth.AuthService; import com.nexuspc.cart.*; import com.nexuspc.catalog.product.*;
import com.nexuspc.order.dto.*; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import java.math.*; import java.util.*;
@Service public class OrderService {
 private final OrderRepository orders; private final ProductRepository products; private final AddressRepository addresses; private final CartRepository carts; private final AuthService auth;
 public OrderService(OrderRepository o,ProductRepository p,AddressRepository a,CartRepository c,AuthService au){orders=o;products=p;addresses=a;carts=c;auth=au;}
 @Transactional public OrderResponse create(String email,OrderRequest r){
  var user=auth.current(email); String[] shipping=shipping(email,r);
  validateChoice(r.deliveryMethod(),Set.of("inside_dhaka","outside_dhaka"),"delivery method");
  validateChoice(r.paymentMethod(),Set.of("cod","bkash","nagad","card","bank_transfer"),"payment method");
  Map<Long,Integer> quantities=new LinkedHashMap<>(); r.items().forEach(i->quantities.merge(i.productId(),i.quantity(),Integer::sum));
  var order=new Order("NPC-"+System.currentTimeMillis()+"-"+UUID.randomUUID().toString().substring(0,6).toUpperCase(),user,shipping[0],shipping[1],shipping[2],shipping[0],shipping[1],shipping[2],shipping[3],shipping[4],shipping[5],shipping[6],r.deliveryMethod(),r.paymentMethod(),BigDecimal.ZERO,BigDecimal.ZERO,r.deliveryMethod().equals("inside_dhaka")?BigDecimal.valueOf(80):BigDecimal.valueOf(150),BigDecimal.ZERO,r.couponCode(),r.notes());
  BigDecimal subtotal=BigDecimal.ZERO;
  for(var entry:quantities.entrySet()){Product p=products.findLockedById(entry.getKey()).orElseThrow(()->new NoSuchElementException("Product not found: "+entry.getKey())); int q=entry.getValue(); if(p.getStockCount()<q) throw new IllegalArgumentException("Insufficient stock for "+p.getName()); p.decreaseStock(q); String image=p.getImages().isEmpty()?null:p.getImages().get(0).getUrl(); var item=new OrderItem(order,p.getId(),p.getName(),p.getBrand(),image,p.getPrice(),q); order.addItem(item); subtotal=subtotal.add(item.getSubtotal());}
  BigDecimal total=subtotal.add(order.getDeliveryCharge()); order.setTotals(subtotal,total);
  carts.findByUserEmailIgnoreCase(email).ifPresent(c->{c.getItems().clear();});
  return OrderResponse.from(orders.save(order));
 }
 private String[] shipping(String email,OrderRequest r){if(r.addressId()!=null){var a=addresses.findByIdAndUserEmailIgnoreCase(r.addressId(),email).orElseThrow(()->new NoSuchElementException("Address not found"));return new String[]{a.getName(),a.getEmail(),a.getPhone(),a.getDivision(),a.getDistrict(),a.getArea(),a.getAddress()};} if(r.shippingAddress()==null) throw new IllegalArgumentException("Provide addressId or shippingAddress"); var a=r.shippingAddress(); return new String[]{a.name(),a.email(),a.phone(),a.division(),a.district(),a.area(),a.address()};}
 private void validateChoice(String value,Set<String> allowed,String label){if(!allowed.contains(value))throw new IllegalArgumentException("Unsupported "+label);}
 @Transactional(readOnly=true) public List<OrderResponse> list(String email){return orders.findByUserEmailIgnoreCaseOrderByCreatedAtDesc(email).stream().map(OrderResponse::from).toList();}
 @Transactional(readOnly=true) public OrderResponse get(String email,Long id){return OrderResponse.from(orders.findByIdAndUserEmailIgnoreCase(id,email).orElseThrow(()->new NoSuchElementException("Order not found")));}
 @Transactional public OrderResponse cancel(String email,Long id){var o=orders.findByIdAndUserEmailIgnoreCase(id,email).orElseThrow(()->new NoSuchElementException("Order not found")); if(!Set.of("pending","confirmed").contains(o.getStatus()))throw new IllegalArgumentException("Order cannot be cancelled"); o.setStatus("cancelled"); return OrderResponse.from(o);}
 @Transactional(readOnly=true) public List<OrderResponse> adminList(){return orders.findAllByOrderByCreatedAtDesc().stream().map(OrderResponse::from).toList();}
 @Transactional public OrderResponse updateStatus(Long id,String status){validateChoice(status,Set.of("pending","confirmed","processing","shipped","delivered","cancelled"),"status"); var o=orders.findById(id).orElseThrow(()->new NoSuchElementException("Order not found")); o.setStatus(status); return OrderResponse.from(o);}
}
