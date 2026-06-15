package com.mentorconnect.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String recipientId;
    private String type;            // DOUBT | RESUME | CHAT | SYSTEM
    private String message;
    private boolean read = false;
    private LocalDateTime timestamp = LocalDateTime.now();
}
