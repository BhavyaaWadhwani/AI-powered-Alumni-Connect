package com.mentorconnect.service;

import com.mentorconnect.model.Mentor;
import com.mentorconnect.repository.MentorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Embeds student interests + mentor skills using Spring AI,
 * computes cosine similarity, and returns top-N ranked mentors.
 */
@Service
@RequiredArgsConstructor
public class AIRecommendationService {

    private final MentorRepository mentorRepository;
    private final EmbeddingModel embeddingModel;

    public List<Mentor> recommend(Map<String, Object> studentProfile, int topN) {
        String studentText = buildStudentText(studentProfile);
        float[] studentVec = embed(studentText);

        List<Mentor> mentors = mentorRepository.findByFraudFlagFalseOrderByPopularityScoreDesc();

        return mentors.stream()
                .map(m -> Map.entry(m, cosineSimilarity(studentVec, embed(buildMentorText(m)))))
                .sorted(Map.Entry.<Mentor, Double>comparingByValue().reversed())
                .limit(topN)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    private String buildStudentText(Map<String, Object> profile) {
        return "Interests: " + profile.getOrDefault("interests", "") +
               " Target companies: " + profile.getOrDefault("targetCompanies", "") +
               " Skills: " + profile.getOrDefault("skills", "") +
               " Goal: " + profile.getOrDefault("goal", "");
    }

    private String buildMentorText(Mentor m) {
        return "Company: " + m.getCompany() +
               " Role: " + m.getRole() +
               " Skills: " + String.join(", ", m.getSkills()) +
               " Achievements: " + String.join(", ", m.getAchievements());
    }

    private float[] embed(String text) {
        return embeddingModel.embed(text);
    }

    private double cosineSimilarity(float[] a, float[] b) {
        double dot = 0, normA = 0, normB = 0;
        int len = Math.min(a.length, b.length);
        for (int i = 0; i < len; i++) {
            dot   += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        return normA == 0 || normB == 0 ? 0 : dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}
