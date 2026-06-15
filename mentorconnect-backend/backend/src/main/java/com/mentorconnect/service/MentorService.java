package com.mentorconnect.service;

import com.mentorconnect.model.Mentor;
import com.mentorconnect.repository.MentorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MentorService {

    private final MentorRepository mentorRepository;

    public List<Mentor> search(String company, String skill, Integer minScore) {
        List<Mentor> all = mentorRepository.findByFraudFlagFalseOrderByPopularityScoreDesc();

        return all.stream()
                .filter(m -> company == null || m.getCompany().toLowerCase().contains(company.toLowerCase()))
                .filter(m -> skill == null || m.getSkills().stream()
                        .anyMatch(s -> s.toLowerCase().contains(skill.toLowerCase())))
                .filter(m -> minScore == null || m.getPopularityScore() >= minScore)
                .toList();
    }

    public Mentor getById(String id) {
        return mentorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
    }

    public Mentor updateProfile(String mentorId, Map<String, Object> payload) {
        Mentor mentor = getById(mentorId);
        if (payload.containsKey("company"))      mentor.setCompany((String) payload.get("company"));
        if (payload.containsKey("skills"))        mentor.setSkills((List<String>) payload.get("skills"));
        if (payload.containsKey("achievements"))  mentor.setAchievements((List<String>) payload.get("achievements"));
        return mentorRepository.save(mentor);
    }

    /** Called by DoubtService when a doubt is resolved */
    public void addPopularityPoints(String mentorId, int points) {
        Mentor mentor = getById(mentorId);
        mentor.setPopularityScore(mentor.getPopularityScore() + points);
        mentor.setResolvedDoubtCount(mentor.getResolvedDoubtCount() + 1);
        mentorRepository.save(mentor);
    }

    public void flagFraud(String mentorId) {
        Mentor mentor = getById(mentorId);
        mentor.setFraudFlag(true);
        mentorRepository.save(mentor);
    }

    public List<Mentor> getLeaderboard() {
        return mentorRepository.findTop10ByOrderByPopularityScoreDesc();
    }
}
