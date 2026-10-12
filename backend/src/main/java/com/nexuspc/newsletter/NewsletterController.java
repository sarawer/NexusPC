package com.nexuspc.newsletter;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/newsletter")
public class NewsletterController {
    private final NewsletterService newsletter;

    public NewsletterController(NewsletterService newsletter) {
        this.newsletter = newsletter;
    }

    @PostMapping("/subscribe")
    public SubscribeResponse subscribe(@Valid @RequestBody SubscribeRequest request) {
        var result = newsletter.subscribe(request.email());
        return new SubscribeResponse(result.alreadySubscribed()
                ? "This email is already subscribed."
                : "Thanks for subscribing to NexusPC updates.", result.alreadySubscribed());
    }

    @GetMapping("/subscribers")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public List<SubscriberResponse> subscribers() {
        return newsletter.listSubscribers().stream()
                .map(subscriber -> new SubscriberResponse(subscriber.getId(), subscriber.getEmail(), subscriber.getSubscribedAt()))
                .toList();
    }

    public record SubscribeRequest(@NotBlank @Email @Size(max = 254) String email) {}
    public record SubscribeResponse(String message, boolean alreadySubscribed) {}
    public record SubscriberResponse(Long id, String email, java.time.Instant subscribedAt) {}
}
