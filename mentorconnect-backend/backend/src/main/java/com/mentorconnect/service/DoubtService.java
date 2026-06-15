package com.mentorconnect.service;

import com.mentorconnect.model.Doubt;
import com.mentorconnect.repository.DoubtRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DoubtService {

    private final DoubtRepository doubtRepository;
    private final MentorService mentorService;
    private final NotificationService notificationService;

    public Doubt create(String studentId, String studentName, Map<String, Object> payload) {
        Doubt doubt = new Doubt();
        doubt.setStudentId(studentId);
        doubt.setStudentName(studentName);
        doubt.setMentorId((String) payload.get("mentorId"));
        doubt.setQuestion((String) payload.get("question"));
        Doubt saved = doubtRepository.save(doubt);

        notificationService.send(doubt.getMentorId(), "DOUBT",
                studentName + " asked you a doubt");
        return saved;
    }

    public List<Doubt> getByMentor(String mentorId) {
        return doubtRepository.findByMentorId(mentorId);
    }

    public List<Doubt> getByStudent(String studentId) {
        return doubtRepository.findByStudentId(studentId);
    }

    public Doubt resolve(String doubtId, String answer, String mentorId) {
        Doubt doubt = doubtRepository.findById(doubtId)
                .orElseThrow(() -> new RuntimeException("Doubt not found"));
        doubt.setAnswer(answer);
        doubt.setStatus("RESOLVED");
        Doubt saved = doubtRepository.save(doubt);

        // +10 popularity points per resolved doubt
        mentorService.addPopularityPoints(mentorId, 10);

        notificationService.send(doubt.getStudentId(), "DOUBT",
                "Your doubt has been answered!");
        return saved;
    }
}
