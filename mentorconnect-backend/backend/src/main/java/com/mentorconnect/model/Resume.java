package com.mentorconnect.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Document(collection = "resumes")
public class Resume {
    @Id
    private String id;
    private String studentId;
    private String studentName;
    private String mentorId;
    private String fileUrl;         // GridFS or S3 URL
    private Integer score;          // 0-100, null until graded
    private List<String> weakPoints = new ArrayList<>();
    private String feedback;
    private LocalDateTime uploadedAt = LocalDateTime.now();
    private LocalDateTime gradedAt;
}
