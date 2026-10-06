package com.nexuspc.address;
import com.nexuspc.address.dto.*;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/addresses") public class AddressController {
 private final AddressService service; public AddressController(AddressService s){service=s;}
 @GetMapping public List<AddressResponse> list(Authentication a){return service.list(a.getName());}
 @PostMapping public AddressResponse create(Authentication a,@Valid @RequestBody AddressRequest r){return service.create(a.getName(),r);}
 @PutMapping("/{id}") public AddressResponse update(Authentication a,@PathVariable Long id,@Valid @RequestBody AddressRequest r){return service.update(a.getName(),id,r);}
 @DeleteMapping("/{id}") public void delete(Authentication a,@PathVariable Long id){service.delete(a.getName(),id);}
 @PutMapping("/{id}/default") public AddressResponse makeDefault(Authentication a,@PathVariable Long id){return service.makeDefault(a.getName(),id);}
}
