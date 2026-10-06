package com.nexuspc.builder.dto;
import java.math.BigDecimal; import java.time.Instant; import java.util.Map;
public record BuildResponse(Long id,String name,Map<String,Long> components,BigDecimal total,boolean compatible,String message,Instant createdAt,Instant updatedAt){}
