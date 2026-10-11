package com.nexuspc.admin;

import com.nexuspc.auth.dto.UserResponse;
import com.nexuspc.user.User;
import com.nexuspc.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class AdminUserService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    public AdminUserService(UserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<AdminCustomerView> listUsers() {
        return users.findAll().stream()
                .map(AdminCustomerView::from)
                .toList();
    }

    @Transactional
    public UserResponse makeAdmin(Long targetId, String adminEmail, String currentPassword) {
        User actingAdmin = users.findByEmailIgnoreCase(adminEmail).orElseThrow();
        if (!passwordEncoder.matches(currentPassword, actingAdmin.getPassword())) {
            throw new AdminVerificationException("Current password is incorrect");
        }

        User target = users.findById(targetId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        target.promoteToAdmin();
        return UserResponse.from(target);
    }

    public record AdminCustomerView(Long id, String name, String email, String phone, String role,
                                    java.time.Instant createdAt) {
        static AdminCustomerView from(User user) {
            return new AdminCustomerView(user.getId(), user.getName(), user.getEmail(),
                    user.getPhone(), user.getRole().name(), user.getCreatedAt());
        }
    }
}
