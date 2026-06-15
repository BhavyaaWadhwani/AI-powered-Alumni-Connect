package com.mentorconnect.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    @Indexed(unique = true)
    private String email;
    private String passwordHash;
    private String role;        // STUDENT | MENTOR
    private String college;
    private List<String> interests = new ArrayList<>();
    private boolean slackerFlag = false;
    private int flagCount = 0;
    private LocalDateTime createdAt = LocalDateTime.now();
}
