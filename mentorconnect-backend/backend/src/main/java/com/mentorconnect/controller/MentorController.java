package com.mentorconnect.controller;

import com.mentorconnect.model.Mentor;
import com.mentorconnect.service.MentorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mentors")
@RequiredArgsConstructor
public class MentorController {

    private final MentorService mentorService;

    @GetMapping("/search")
    public ResponseEntity<List<Mentor>> search(
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) Integer minScore) {
        return ResponseEntity.ok(mentorService.search(company, skill, minScore));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mentor> getById(@PathVariable String id) {
        return ResponseEntity.ok(mentorService.getById(id));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<Mentor> updateProfile(
            @AuthenticationPrincipal String userId,
            @RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(mentorService.updateProfile(userId, payload));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<Mentor>> leaderboard() {
        return ResponseEntity.ok(mentorService.getLeaderboard());
    }
}
