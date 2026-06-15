package com.mentorconnect.service;

import com.mentorconnect.model.Notification;
import com.mentorconnect.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public void send(String recipientId, String type, String message) {
        Notification n = new Notification();
        n.setRecipientId(recipientId);
        n.setType(type);
        n.setMessage(message);
        notificationRepository.save(n);

        // Push via WebSocket
        messagingTemplate.convertAndSendToUser(
                recipientId, "/queue/notifications", n);
    }

    public List<Notification> getAll(String recipientId) {
        return notificationRepository.findByRecipientIdOrderByTimestampDesc(recipientId);
    }

    public void markAllRead(String recipientId) {
        List<Notification> unread = notificationRepository.findByRecipientIdAndReadFalse(recipientId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}
