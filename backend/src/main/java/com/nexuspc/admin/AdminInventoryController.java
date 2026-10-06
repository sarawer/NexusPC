package com.nexuspc.admin;
import com.nexuspc.catalog.product.*; import jakarta.validation.Valid; import jakarta.validation.constraints.*; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/admin/inventory") @PreAuthorize("hasRole('ADMIN')") public class AdminInventoryController {
 private final ProductRepository products; public AdminInventoryController(ProductRepository p){products=p;}
 public record StockUpdate(@Min(0) int stockCount){}
 @GetMapping("/low-stock") public List<Product> lowStock(){return products.findAll().stream().filter(p->p.getStockCount()<10).toList();}
 @PutMapping("/{id}") public Product update(@PathVariable Long id,@Valid @RequestBody StockUpdate r){Product p=products.findById(id).orElseThrow(()->new NoSuchElementException("Product not found"));p.setStockCount(r.stockCount());return p;}
}
