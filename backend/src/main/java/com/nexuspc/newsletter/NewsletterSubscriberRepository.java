package com.nexuspc.newsletter;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsletterSubscriberRepository extends JpaRepository<NewsletterSubscriber, Long> {
    boolean existsByEmail(String email);
    List<NewsletterSubscriber> findAllByOrderBySubscribedAtDesc();
}
