package com.nexuspc.address;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface AddressRepository extends JpaRepository<Address,Long> {
 List<Address> findByUserEmailIgnoreCaseOrderByIdAsc(String email);
 Optional<Address> findByIdAndUserEmailIgnoreCase(Long id,String email);
}
