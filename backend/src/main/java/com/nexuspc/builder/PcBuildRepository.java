package com.nexuspc.builder;
import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface PcBuildRepository extends JpaRepository<PcBuild,Long>{List<PcBuild> findByUserEmailIgnoreCaseOrderByUpdatedAtDesc(String email);Optional<PcBuild> findByIdAndUserEmailIgnoreCase(Long id,String email);}
