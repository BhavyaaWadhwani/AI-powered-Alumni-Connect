package com.mentorconnect.controller;

import com.mentorconnect.model.User;
import com.mentorconnect.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(authService.register(payload));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(authService.login(payload));
    }

    @GetMapping("/me")
    public ResponseEntity<User> me(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(authService.getMe(userId));
    }
}
