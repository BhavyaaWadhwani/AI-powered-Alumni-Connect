package com.mentorconnect.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "ai_flags")
public class AIFlag {
    @Id
    private String id;
    private String userId;
    private String flagType;        // SLACKER | FRAUD
    private String reason;
    private double confidenceScore;
    private LocalDateTime createdAt = LocalDateTime.now();
}
