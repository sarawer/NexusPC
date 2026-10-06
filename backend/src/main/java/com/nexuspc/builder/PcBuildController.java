package com.nexuspc.builder;
import com.nexuspc.builder.dto.*; import jakarta.validation.Valid; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/pc-builder") public class PcBuildController {
 private final PcBuildService service; public PcBuildController(PcBuildService s){service=s;}
 @PostMapping("/validate") public BuildResponse validate(@RequestBody Map<String,Long> components){return service.validate(components);}
 @GetMapping("/builds") public List<BuildResponse> list(Authentication a){return service.list(a.getName());}
 @PostMapping("/builds") public BuildResponse save(Authentication a,@Valid @RequestBody BuildRequest r){return service.save(a.getName(),r);}
 @GetMapping("/builds/{id}") public BuildResponse get(Authentication a,@PathVariable Long id){return service.get(a.getName(),id);}
 @DeleteMapping("/builds/{id}") public void delete(Authentication a,@PathVariable Long id){service.delete(a.getName(),id);}
}
