package com.mentorconnect.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "messages")
public class Message {
    @Id
    private String id;
    private String senderId;
    private String receiverId;
    private String content;
    private String fileUrl;
    private String fileName;
    private String type = "TEXT";   // TEXT | FILE
    private LocalDateTime timestamp = LocalDateTime.now();
}
