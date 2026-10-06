package com.nexuspc.address;
import com.nexuspc.auth.AuthService;
import com.nexuspc.address.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
@Service public class AddressService {
 private final AddressRepository repo; private final AuthService auth;
 public AddressService(AddressRepository r,AuthService a){repo=r;auth=a;}
 @Transactional(readOnly=true) public List<AddressResponse> list(String email){return repo.findByUserEmailIgnoreCaseOrderByIdAsc(email).stream().map(AddressResponse::from).toList();}
 @Transactional public AddressResponse create(String email,AddressRequest r){var a=new Address(auth.current(email),r.name().trim(),r.email().trim(),r.phone().trim(),r.division().trim(),r.district().trim(),r.area().trim(),r.address().trim(),Boolean.TRUE.equals(r.isDefault())); if(a.isDefaultAddress()||repo.findByUserEmailIgnoreCaseOrderByIdAsc(email).isEmpty()) clearDefaults(email); return AddressResponse.from(repo.save(a));}
 @Transactional public AddressResponse update(String email,Long id,AddressRequest r){var a=repo.findByIdAndUserEmailIgnoreCase(id,email).orElseThrow(()->new NoSuchElementException("Address not found")); boolean wasDefault=a.isDefaultAddress(); if(Boolean.TRUE.equals(r.isDefault())) clearDefaults(email); a.update(r.name().trim(),r.email().trim(),r.phone().trim(),r.division().trim(),r.district().trim(),r.area().trim(),r.address().trim()); a.setDefaultAddress(r.isDefault()==null?wasDefault:Boolean.TRUE.equals(r.isDefault())); return AddressResponse.from(a);}
 @Transactional public void delete(String email,Long id){var a=repo.findByIdAndUserEmailIgnoreCase(id,email).orElseThrow(()->new NoSuchElementException("Address not found")); boolean wasDefault=a.isDefaultAddress(); repo.delete(a); if(wasDefault) repo.findByUserEmailIgnoreCaseOrderByIdAsc(email).stream().filter(x->!x.getId().equals(id)).findFirst().ifPresent(x->x.setDefaultAddress(true));}
 @Transactional public AddressResponse makeDefault(String email,Long id){var a=repo.findByIdAndUserEmailIgnoreCase(id,email).orElseThrow(()->new NoSuchElementException("Address not found")); clearDefaults(email); a.setDefaultAddress(true); return AddressResponse.from(a);}
 private void clearDefaults(String email){repo.findByUserEmailIgnoreCaseOrderByIdAsc(email).forEach(a->a.setDefaultAddress(false));}
}
