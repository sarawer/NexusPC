package com.nexuspc.admin;

import com.nexuspc.auth.dto.UserResponse;
import com.nexuspc.user.User;
import com.nexuspc.user.UserRepository;
import com.nexuspc.user.UserRole;
import org.springframework.security.access.AccessDeniedException;
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
    public UserResponse changeRole(Long targetId, String adminEmail, String role, String currentPassword) {
        User actingAdmin = users.findByEmailIgnoreCase(adminEmail).orElseThrow();
        if (actingAdmin.getRole() != UserRole.SUPER_ADMIN) {
            throw new AccessDeniedException("Only a super admin can change user roles");
        }
        if (!passwordEncoder.matches(currentPassword, actingAdmin.getPassword())) {
            throw new AdminVerificationException("Current password is incorrect");
        }

        User target = users.findById(targetId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        if (target.getRole() == UserRole.SUPER_ADMIN) {
            throw new IllegalArgumentException("Super admin accounts are protected from role changes");
        }
        UserRole targetRole;
        try {
            targetRole = UserRole.valueOf(role);
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("Role must be CUSTOMER or ADMIN");
        }
        if (targetRole == UserRole.SUPER_ADMIN) {
            throw new IllegalArgumentException("A super admin cannot be assigned from the admin panel");
        }
        target.setRole(targetRole);
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
