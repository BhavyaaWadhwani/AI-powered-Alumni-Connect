package com.mentorconnect.controller;

import com.mentorconnect.model.Message;
import com.mentorconnect.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /** WebSocket message handler */
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload Map<String, Object> payload) {
        chatService.saveAndSend(payload);
    }

    /** REST: fetch conversation history */
    @GetMapping("/api/chat/history/{peerId}")
    public ResponseEntity<List<Message>> history(
            @PathVariable String peerId,
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(chatService.getHistory(userId, peerId));
    }

    /** REST: send file message */
    @PostMapping("/api/chat/file")
    public ResponseEntity<Message> sendFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("receiverId") String receiverId,
            @AuthenticationPrincipal String senderId) throws IOException {
        String fileUrl = "/files/" + file.getOriginalFilename();
        Map<String, Object> payload = Map.of(
                "senderId",   senderId,
                "receiverId", receiverId,
                "type",       "FILE",
                "fileUrl",    fileUrl,
                "fileName",   file.getOriginalFilename()
        );
        return ResponseEntity.ok(chatService.saveAndSend(payload));
    }
}
