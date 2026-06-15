package com.mentorconnect.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "doubts")
public class Doubt {
    @Id
    private String id;
    private String studentId;
    private String studentName;
    private String mentorId;
    private String question;
    private String answer;
    private String status = "OPEN";  // OPEN | RESOLVED
    private boolean isDuplicate = false;
    private LocalDateTime createdAt = LocalDateTime.now();
}
