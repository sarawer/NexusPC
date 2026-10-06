package com.nexuspc.catalog.product;
import jakarta.persistence.Embeddable;
@Embeddable public class ProductImage { private String url; private String alt;
 protected ProductImage(){} public ProductImage(String url,String alt){this.url=url;this.alt=alt;}
 public String getUrl(){return url;} public String getAlt(){return alt;}
}
