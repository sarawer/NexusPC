package com.nexuspc.newsletter;

import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NewsletterService {
    private final NewsletterSubscriberRepository subscribers;

    public NewsletterService(NewsletterSubscriberRepository subscribers) {
        this.subscribers = subscribers;
    }

    @Transactional
    public SubscribeResult subscribe(String email) {
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        if (subscribers.existsByEmail(normalizedEmail)) {
            return new SubscribeResult(true);
        }
        subscribers.save(new NewsletterSubscriber(normalizedEmail));
        return new SubscribeResult(false);
    }

    @Transactional(readOnly = true)
    public List<NewsletterSubscriber> listSubscribers() {
        return subscribers.findAllByOrderBySubscribedAtDesc();
    }

    public record SubscribeResult(boolean alreadySubscribed) {}
}
