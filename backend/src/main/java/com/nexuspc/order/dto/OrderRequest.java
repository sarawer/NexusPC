package com.nexuspc.order.dto;
import com.nexuspc.address.dto.AddressRequest; import jakarta.validation.Valid; import jakarta.validation.constraints.*; import java.util.*;
public record OrderRequest(@NotEmpty List<@Valid OrderItemRequest> items,Long addressId,@Valid AddressRequest shippingAddress,@NotBlank String deliveryMethod,@NotBlank String paymentMethod,String couponCode,String notes){}
