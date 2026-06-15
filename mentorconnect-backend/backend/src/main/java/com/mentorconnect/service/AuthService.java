package com.mentorconnect.service;

import com.mentorconnect.model.Mentor;
import com.mentorconnect.model.User;
import com.mentorconnect.repository.MentorRepository;
import com.mentorconnect.repository.UserRepository;
import com.mentorconnect.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final MentorRepository mentorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public Map<String, Object> register(Map<String, Object> payload) {
        String email = (String) payload.get("email");
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName((String) payload.get("name"));
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode((String) payload.get("password")));
        user.setRole((String) payload.get("role"));
        user.setCollege((String) payload.getOrDefault("college", ""));

        if (payload.containsKey("interests")) {
            user.setInterests((List<String>) payload.get("interests"));
        }
        userRepository.save(user);

        // If mentor, also create Mentor document
        if ("MENTOR".equals(user.getRole())) {
            Mentor mentor = new Mentor();
            mentor.setId(user.getId());
            mentor.setName(user.getName());
            mentor.setEmail(user.getEmail());
            mentor.setCompany((String) payload.getOrDefault("company", ""));
            mentor.setRole((String) payload.getOrDefault("jobTitle", ""));
            if (payload.containsKey("skills")) {
                mentor.setSkills((List<String>) payload.get("skills"));
            }
            mentorRepository.save(mentor);
        }

        String token = tokenProvider.generateToken(user.getId(), user.getRole());
        return buildResponse(token, user);
    }

    public Map<String, Object> login(Map<String, Object> payload) {
        String email    = (String) payload.get("email");
        String password = (String) payload.get("password");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = tokenProvider.generateToken(user.getId(), user.getRole());
        return buildResponse(token, user);
    }

    public User getMe(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Map<String, Object> buildResponse(String token, User user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id",    user.getId());
        userMap.put("name",  user.getName());
        userMap.put("email", user.getEmail());
        userMap.put("role",  user.getRole());
        userMap.put("college", user.getCollege());

        Map<String, Object> res = new HashMap<>();
        res.put("token", token);
        res.put("user",  userMap);
        return res;
    }
}
