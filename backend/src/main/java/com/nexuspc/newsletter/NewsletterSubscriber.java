package com.nexuspc.newsletter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;

@Entity
@Table(name = "newsletter_subscribers", uniqueConstraints =
        @UniqueConstraint(name = "uk_newsletter_subscriber_email", columnNames = "email"))
public class NewsletterSubscriber {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 254)
    private String email;

    @Column(nullable = false, updatable = false)
    private Instant subscribedAt;

    protected NewsletterSubscriber() {}

    public NewsletterSubscriber(String email) {
        this.email = email;
    }

    @PrePersist
    void onCreate() {
        if (subscribedAt == null) subscribedAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public Instant getSubscribedAt() { return subscribedAt; }
}
