package com.mentorconnect.service;

import com.mentorconnect.model.Message;
import com.mentorconnect.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public Message saveAndSend(Map<String, Object> payload) {
        Message msg = new Message();
        msg.setSenderId((String)  payload.get("senderId"));
        msg.setReceiverId((String) payload.get("receiverId"));
        msg.setContent((String)   payload.getOrDefault("content", ""));
        msg.setType((String)      payload.getOrDefault("type", "TEXT"));
        msg.setFileUrl((String)   payload.get("fileUrl"));
        msg.setFileName((String)  payload.get("fileName"));
        Message saved = messageRepository.save(msg);

        // Push to receiver via WebSocket
        messagingTemplate.convertAndSendToUser(
                msg.getReceiverId(),
                "/queue/messages",
                saved
        );
        return saved;
    }

    public List<Message> getHistory(String userA, String userB) {
        return messageRepository.findConversation(userA, userB);
    }
}
