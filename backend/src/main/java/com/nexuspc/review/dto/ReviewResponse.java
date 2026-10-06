package com.nexuspc.review.dto;
import java.time.Instant;
public record ReviewResponse(Long id,Long productId,String productName,String author,int rating,String comment,String status,boolean verified,Instant createdAt){}
