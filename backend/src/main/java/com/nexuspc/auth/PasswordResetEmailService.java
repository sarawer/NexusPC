package com.nexuspc.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class PasswordResetEmailService {
    private static final Logger log = LoggerFactory.getLogger(PasswordResetEmailService.class);
    private final JavaMailSender mailSender;
    private final String from;
    private final String frontendUrl;

    public PasswordResetEmailService(JavaMailSender mailSender,
            @Value("${app.mail.from:}") String from,
            @Value("${app.frontend-url:http://localhost:3000}") String frontendUrl) {
        this.mailSender = mailSender;
        this.from = from;
        this.frontendUrl = frontendUrl.replaceAll("/$", "");
    }

    @Async
    public void sendResetLink(String email, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (from != null && !from.isBlank()) message.setFrom(from);
            message.setTo(email);
            message.setSubject("Reset your NexusPC password");
            message.setText("We received a request to reset your NexusPC password.\n\n"
                    + "Use this link within 30 minutes to choose a new password:\n"
                    + frontendUrl + "/reset-password?token=" + token
                    + "\n\nIf you did not request this, you can ignore this email.");
            mailSender.send(message);
        } catch (Exception exception) {
            log.warn("Unable to send a password reset email.");
        }
    }
}
