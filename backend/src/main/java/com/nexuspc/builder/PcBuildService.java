package com.nexuspc.builder;
import com.nexuspc.builder.dto.*; import com.nexuspc.catalog.product.*; import com.nexuspc.user.*; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional; import java.math.*; import java.util.*;
@Service public class PcBuildService {
 private final PcBuildRepository builds; private final ProductRepository products; private final UserRepository users;
 public PcBuildService(PcBuildRepository b,ProductRepository p,UserRepository u){builds=b;products=p;users=u;}
 public BuildResponse validate(Map<String,Long> ids){var ps=ids.entrySet().stream().map(e->products.findById(e.getValue()).orElseThrow(()->new NoSuchElementException("Product not found: "+e.getValue()))).toList();String message=check(ids,ps);BigDecimal total=ps.stream().map(Product::getPrice).reduce(BigDecimal.ZERO,BigDecimal::add);return new BuildResponse(null,null,ids,total,message==null,"".equals(message==null?"":message)?"Compatible":message,null,null);}
 @Transactional public BuildResponse save(String email,BuildRequest r){var v=validate(r.components());if(!v.compatible())throw new IllegalArgumentException(v.message());PcBuild b=builds.save(new PcBuild(users.findByEmailIgnoreCase(email).orElseThrow(),r.name(),r.components()));return response(b,v);}
 public List<BuildResponse> list(String email){return builds.findByUserEmailIgnoreCaseOrderByUpdatedAtDesc(email).stream().map(b->response(b,validate(b.getComponents()))).toList();}
 public BuildResponse get(String email,Long id){PcBuild b=builds.findByIdAndUserEmailIgnoreCase(id,email).orElseThrow(()->new NoSuchElementException("Build not found"));return response(b,validate(b.getComponents()));}
 @Transactional public void delete(String email,Long id){builds.delete(builds.findByIdAndUserEmailIgnoreCase(id,email).orElseThrow(()->new NoSuchElementException("Build not found")));}
 private BuildResponse response(PcBuild b,BuildResponse v){return new BuildResponse(b.getId(),b.getName(),b.getComponents(),v.total(),v.compatible(),v.message(),b.getCreatedAt(),b.getUpdatedAt());}
 private String check(Map<String,Long> ids,List<Product> ps){if(ps.stream().anyMatch(p->p.getStockCount()<1))return "One or more components are out of stock";Long cpu=idFor(ids,"cpu"),board=idFor(ids,"motherboard");if(cpu!=null&&board!=null){String c=spec(ps,cpu,"Socket"),m=spec(ps,board,"Socket");if(c!=null&&m!=null&&!c.equalsIgnoreCase(m))return "CPU and motherboard sockets are incompatible";}return null;}
 private Long idFor(Map<String,Long> ids,String key){return ids.entrySet().stream().filter(e->e.getKey().equalsIgnoreCase(key)).map(Map.Entry::getValue).findFirst().orElse(null);}
 private String spec(List<Product> ps,Long id,String key){return ps.stream().filter(p->p.getId().equals(id)).findFirst().map(p->p.getSpecifications().get(key)).orElse(null);}
}
