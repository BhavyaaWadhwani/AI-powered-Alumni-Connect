package com.mentorconnect.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Document(collection = "mentors")
public class Mentor {
    @Id
    private String id;          // same as User.id
    private String name;
    private String email;
    private String company;
    private String role;        // job title e.g. SWE, ML Engineer
    private List<String> skills = new ArrayList<>();
    private List<String> achievements = new ArrayList<>();
    private int popularityScore = 0;
    private int resolvedDoubtCount = 0;
    private boolean fraudFlag = false;
    private List<String> reviewList = new ArrayList<>();
}
