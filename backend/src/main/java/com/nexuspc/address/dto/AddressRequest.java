package com.nexuspc.address.dto;
import jakarta.validation.constraints.*;
public record AddressRequest(@NotBlank String name,@NotBlank @Email String email,@NotBlank String phone,@NotBlank String division,@NotBlank String district,@NotBlank String area,@NotBlank String address,Boolean isDefault){}
