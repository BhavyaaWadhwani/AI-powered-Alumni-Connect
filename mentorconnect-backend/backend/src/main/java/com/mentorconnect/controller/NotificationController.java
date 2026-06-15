package com.mentorconnect.controller;

import com.mentorconnect.model.Notification;
import com.mentorconnect.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getAll(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(notificationService.getAll(userId));
    }

    @PutMapping("/read")
    public ResponseEntity<?> markRead(@AuthenticationPrincipal String userId) {
        notificationService.markAllRead(userId);
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
