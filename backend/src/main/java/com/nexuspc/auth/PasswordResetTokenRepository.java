package com.nexuspc.auth;

import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select t from PasswordResetToken t join fetch t.user where t.tokenHash = :tokenHash")
    Optional<PasswordResetToken> findForUpdateByTokenHash(@Param("tokenHash") String tokenHash);

    Optional<PasswordResetToken> findTopByUser_IdOrderByCreatedAtDesc(Long userId);

    void deleteAllByUser_Id(Long userId);
}
