package com.nexuspc.address.dto;
import com.nexuspc.address.Address;
public record AddressResponse(Long id,String name,String email,String phone,String division,String district,String area,String address,boolean isDefault) {
 public static AddressResponse from(Address a){return new AddressResponse(a.getId(),a.getName(),a.getEmail(),a.getPhone(),a.getDivision(),a.getDistrict(),a.getArea(),a.getAddress(),a.isDefaultAddress());}
}
