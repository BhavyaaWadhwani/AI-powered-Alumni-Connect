package com.mentorconnect.repository;

import com.mentorconnect.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByRecipientIdOrderByTimestampDesc(String recipientId);
    List<Notification> findByRecipientIdAndReadFalse(String recipientId);
}
