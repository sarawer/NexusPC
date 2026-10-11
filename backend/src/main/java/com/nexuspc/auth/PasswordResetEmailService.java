package com.nexuspc.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class PasswordResetEmailService {
    private static final Logger log = LoggerFactory.getLogger(PasswordResetEmailService.class);
    private static final URI RESEND_EMAILS_URI = URI.create("https://api.resend.com/emails");
    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5)).build();
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String from;
    private final String frontendUrl;

    public PasswordResetEmailService(ObjectMapper objectMapper,
            @Value("${resend.api-key:}") String apiKey,
            @Value("${resend.from:}") String from,
            @Value("${app.frontend-url:http://localhost:3000}") String frontendUrl) {
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.from = from;
        this.frontendUrl = frontendUrl.replaceAll("/$", "");
    }

    @Async
    public void sendResetLink(String email, String token) {
        try {
            if (apiKey == null || apiKey.isBlank() || from == null || from.isBlank()) {
                log.warn("Password reset email is not configured. Set RESEND_API_KEY and RESEND_FROM.");
                return;
            }
            String resetLink = frontendUrl + "/reset-password?token=" + token;
            String html = "<div style=\"font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#111827\">"
                    + "<h2>Reset your NexusPC password</h2>"
                    + "<p>We received a request to reset the password for your NexusPC account.</p>"
                    + "<p><a href=\"" + resetLink + "\" style=\"display:inline-block;background:#2563eb;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none\">Choose a new password</a></p>"
                    + "<p>This link expires in 30 minutes and can only be used once.</p>"
                    + "<p>If you did not request this, you can ignore this email.</p></div>";
            String text = "We received a request to reset your NexusPC password.\n\n"
                    + "Choose a new password within 30 minutes: " + resetLink
                    + "\n\nIf you did not request this, you can ignore this email.";
            String body = objectMapper.writeValueAsString(Map.of(
                    "from", from,
                    "to", List.of(email),
                    "subject", "Reset your NexusPC password",
                    "html", html,
                    "text", text));
            HttpRequest request = HttpRequest.newBuilder(RESEND_EMAILS_URI)
                    .timeout(Duration.ofSeconds(10))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();
            HttpResponse<Void> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.discarding());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.warn("Password reset email provider returned HTTP status {}.", response.statusCode());
            }
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            log.warn("Password reset email request was interrupted.");
        } catch (Exception exception) {
            log.warn("Unable to send a password reset email through the provider API.");
        }
    }
}
