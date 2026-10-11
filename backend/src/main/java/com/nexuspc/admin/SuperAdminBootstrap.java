package com.nexuspc.admin;

import com.nexuspc.user.User;
import com.nexuspc.user.UserRepository;
import com.nexuspc.user.UserRole;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class SuperAdminBootstrap implements ApplicationRunner {
    private static final System.Logger log = System.getLogger(SuperAdminBootstrap.class.getName());
    private final UserRepository users;
    private final PasswordEncoder passwords;
    private final String email;
    private final String password;

    public SuperAdminBootstrap(UserRepository users, PasswordEncoder passwords,
            @Value("${BOOTSTRAP_SUPERADMIN_EMAIL:}") String email,
            @Value("${BOOTSTRAP_SUPERADMIN_PASSWORD:}") String password) {
        this.users = users;
        this.passwords = passwords;
        this.email = email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
        this.password = password == null ? "" : password;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (email.isBlank() || password.isBlank()) {
            log.log(System.Logger.Level.WARNING, "Super admin bootstrap is disabled: bootstrap environment variables are not configured.");
            return;
        }
        if (password.length() < 8) {
            throw new IllegalStateException("BOOTSTRAP_SUPERADMIN_PASSWORD must be at least 8 characters");
        }

        var existing = users.findByEmailIgnoreCase(email);
        if (existing.isPresent()) {
            if (existing.get().getRole() != UserRole.SUPER_ADMIN) {
                log.log(System.Logger.Level.ERROR, "The configured super admin email already belongs to a non-super-admin account. No role was changed.");
            }
            return;
        }

        try {
            users.saveAndFlush(new User("NexusPC Super Admin", email, null, passwords.encode(password), UserRole.SUPER_ADMIN));
            log.log(System.Logger.Level.INFO, "Initial super admin account created from environment configuration.");
        } catch (DataIntegrityViolationException race) {
            var concurrent = users.findByEmailIgnoreCase(email);
            if (concurrent.isEmpty() || concurrent.get().getRole() != UserRole.SUPER_ADMIN) throw race;
        }
    }
}
