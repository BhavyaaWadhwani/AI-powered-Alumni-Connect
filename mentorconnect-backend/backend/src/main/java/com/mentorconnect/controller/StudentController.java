package com.mentorconnect.controller;

import com.mentorconnect.model.User;
import com.mentorconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable String id) {
        return ResponseEntity.ok(
                userRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found")));
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal String userId,
            @RequestBody Map<String, Object> payload) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Not found"));
        if (payload.containsKey("interests"))
            user.setInterests((List<String>) payload.get("interests"));
        if (payload.containsKey("college"))
            user.setCollege((String) payload.get("college"));
        return ResponseEntity.ok(userRepository.save(user));
    }
}
