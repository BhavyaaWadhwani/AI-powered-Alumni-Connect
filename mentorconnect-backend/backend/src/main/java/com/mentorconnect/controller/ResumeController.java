package com.mentorconnect.controller;

import com.mentorconnect.model.Resume;
import com.mentorconnect.service.AuthService;
import com.mentorconnect.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;
    private final AuthService   authService;

    @PostMapping("/upload")
    public ResponseEntity<Resume> upload(
            @AuthenticationPrincipal String userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("mentorId") String mentorId) throws IOException {
        String name = authService.getMe(userId).getName();
        return ResponseEntity.ok(resumeService.upload(userId, name, mentorId, file));
    }

    @PostMapping("/{id}/grade")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<Resume> grade(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(resumeService.grade(id, payload));
    }

    @GetMapping("/feedback")
    public ResponseEntity<List<Resume>> feedback(
            @RequestParam String studentId) {
        return ResponseEntity.ok(resumeService.getFeedback(studentId));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<List<Resume>> pending(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(resumeService.getPendingForMentor(userId));
    }
}
