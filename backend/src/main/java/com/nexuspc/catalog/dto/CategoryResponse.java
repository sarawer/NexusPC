package com.nexuspc.catalog.dto;
public record CategoryResponse(Long id,String slug,String name,String description,String icon,long productCount,String image) {}
