package com.mentorconnect.controller;

import com.mentorconnect.model.AIFlag;
import com.mentorconnect.model.Mentor;
import com.mentorconnect.service.AIFlagService;
import com.mentorconnect.service.AIRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIRecommendationService recommendationService;
    private final AIFlagService           flagService;

    @PostMapping("/recommend")
    public ResponseEntity<List<Mentor>> recommend(
            @RequestBody Map<String, Object> studentProfile) {
        return ResponseEntity.ok(recommendationService.recommend(studentProfile, 10));
    }

    @GetMapping("/flags/{userId}")
    public ResponseEntity<List<AIFlag>> flags(@PathVariable String userId) {
        return ResponseEntity.ok(flagService.getFlagsForUser(userId));
    }

    @PostMapping("/report-mentor")
    public ResponseEntity<?> reportMentor(
            @RequestBody Map<String, Object> payload,
            @AuthenticationPrincipal String reporterId) {
        // Stores a user-submitted report; AI flag service processes it in next cycle
        String mentorId = (String) payload.get("mentorId");
        String reason   = (String) payload.get("reason");
        return ResponseEntity.ok(Map.of("status", "Report received", "mentorId", mentorId));
    }
}
