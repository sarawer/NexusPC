package com.nexuspc.catalog.category;
import jakarta.persistence.*;
@Entity @Table(name="categories", uniqueConstraints=@UniqueConstraint(name="uk_category_slug", columnNames="slug"))
public class Category {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=120) private String name;
 @Column(nullable=false,unique=true,length=140) private String slug;
 @Column(length=1000) private String description;
 @Column(length=1000) private String icon;
 @Column(length=1000) private String image;
 protected Category() {}
 public Category(String name,String slug,String description,String icon,String image){this.name=name;this.slug=slug;this.description=description;this.icon=icon;this.image=image;}
 public Long getId(){return id;} public String getName(){return name;} public String getSlug(){return slug;} public String getDescription(){return description;} public String getIcon(){return icon;} public String getImage(){return image;}
 public void update(String name,String slug,String description,String icon,String image){this.name=name;this.slug=slug;this.description=description;this.icon=icon;this.image=image;}
}
