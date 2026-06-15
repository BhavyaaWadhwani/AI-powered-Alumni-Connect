package com.mentorconnect.controller;

import com.mentorconnect.model.Doubt;
import com.mentorconnect.service.AuthService;
import com.mentorconnect.service.DoubtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doubts")
@RequiredArgsConstructor
public class DoubtController {

    private final DoubtService doubtService;
    private final AuthService  authService;

    @PostMapping
    public ResponseEntity<Doubt> create(
            @AuthenticationPrincipal String userId,
            @RequestBody Map<String, Object> payload) {
        String name = authService.getMe(userId).getName();
        return ResponseEntity.ok(doubtService.create(userId, name, payload));
    }

    /** Mentor fetches their doubt inbox */
    @GetMapping
    public ResponseEntity<List<Doubt>> list(
            @RequestParam(required = false) String mentorId,
            @AuthenticationPrincipal String userId) {
        String id = mentorId != null ? mentorId : userId;
        return ResponseEntity.ok(doubtService.getByMentor(id));
    }

    /** Student fetches their own doubts */
    @GetMapping("/mine")
    public ResponseEntity<List<Doubt>> mine(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(doubtService.getByStudent(userId));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Doubt> resolve(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload,
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(
                doubtService.resolve(id, (String) payload.get("answer"), userId));
    }
}
