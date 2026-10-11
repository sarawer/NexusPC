package com.nexuspc.auth;

import com.nexuspc.auth.dto.ForgotPasswordRequest;
import com.nexuspc.auth.dto.ResetPasswordRequest;
import com.nexuspc.auth.dto.ChangePasswordRequest;
import com.nexuspc.user.User;
import com.nexuspc.user.UserRepository;
import com.nexuspc.user.UserRole;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PasswordResetService {
    private static final Duration TOKEN_LIFETIME = Duration.ofMinutes(30);
    private static final Duration REQUEST_COOLDOWN = Duration.ofSeconds(60);
    private static final SecureRandom RANDOM = new SecureRandom();
    private final UserRepository users;
    private final PasswordResetTokenRepository tokens;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetEmailService emailService;

    public PasswordResetService(UserRepository users, PasswordResetTokenRepository tokens,
            PasswordEncoder passwordEncoder, PasswordResetEmailService emailService) {
        this.users = users;
        this.tokens = tokens;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public void requestReset(ForgotPasswordRequest request) {
        users.findByEmailIgnoreCase(request.email().trim()).filter(user -> user.getRole() != UserRole.SUPER_ADMIN)
                .ifPresent(user -> {
                    Instant now = Instant.now();
                    var latest = tokens.findTopByUser_IdOrderByCreatedAtDesc(user.getId());
                    if (latest.isPresent() && latest.get().getCreatedAt().isAfter(now.minus(REQUEST_COOLDOWN))) return;

                    tokens.deleteAllByUser_Id(user.getId());
                    byte[] randomBytes = new byte[32];
                    RANDOM.nextBytes(randomBytes);
                    String token = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
                    tokens.save(new PasswordResetToken(user, hashToken(token), now, now.plus(TOKEN_LIFETIME)));
                    emailService.sendResetLink(user.getEmail(), token);
                });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        Instant now = Instant.now();
        PasswordResetToken token = tokens.findForUpdateByTokenHash(hashToken(request.token()))
                .filter(candidate -> candidate.getUsedAt() == null && candidate.getExpiresAt().isAfter(now))
                .orElseThrow(() -> new IllegalArgumentException("This password reset link is invalid or expired."));
        User user = token.getUser();
        if (user.getRole() == UserRole.SUPER_ADMIN) {
            throw new IllegalArgumentException("This password reset link is invalid or expired.");
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        token.markUsed(now);
        tokens.deleteAllByUser_Id(user.getId());
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = users.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("Account was not found."));
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect.");
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        tokens.deleteAllByUser_Id(user.getId());
    }

    private String hashToken(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
            return java.util.HexFormat.of().formatHex(digest);
        } catch (java.security.NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }
}
