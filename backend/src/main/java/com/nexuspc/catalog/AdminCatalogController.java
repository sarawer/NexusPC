package com.nexuspc.catalog;

import com.nexuspc.catalog.category.CategoryService;
import com.nexuspc.catalog.dto.*;
import com.nexuspc.catalog.product.ProductService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** Explicit admin namespace kept as a stable API for dashboard clients. */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminCatalogController {
    private final CategoryService categories;
    private final ProductService products;
    public AdminCatalogController(CategoryService categories, ProductService products) { this.categories = categories; this.products = products; }
    @PostMapping("/categories") public CategoryResponse createCategory(@Valid @RequestBody CategoryRequest request) { return categories.create(request); }
    @PutMapping("/categories/{id}") public CategoryResponse updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) { return categories.update(id, request); }
    @DeleteMapping("/categories/{id}") public void deleteCategory(@PathVariable Long id) { categories.delete(id); }
    @PostMapping("/products") public ProductResponse createProduct(@Valid @RequestBody ProductRequest request) { return products.create(request); }
    @PutMapping("/products/{id}") public ProductResponse updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) { return products.update(id, request); }
    @DeleteMapping("/products/{id}") public void deleteProduct(@PathVariable Long id) { products.delete(id); }
}
