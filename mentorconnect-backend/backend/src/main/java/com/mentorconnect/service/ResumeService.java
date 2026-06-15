package com.mentorconnect.service;

import com.mentorconnect.model.Resume;
import com.mentorconnect.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final NotificationService notificationService;

    public Resume upload(String studentId, String studentName,
                         String mentorId, MultipartFile file) throws IOException {
        // In production: store file in GridFS / S3, save URL
        String fileUrl = "/files/" + studentId + "_" + file.getOriginalFilename();

        Resume resume = new Resume();
        resume.setStudentId(studentId);
        resume.setStudentName(studentName);
        resume.setMentorId(mentorId);
        resume.setFileUrl(fileUrl);
        Resume saved = resumeRepository.save(resume);

        notificationService.send(mentorId, "RESUME",
                studentName + " sent you a resume for review");
        return saved;
    }

    public Resume grade(String resumeId, Map<String, Object> payload) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        resume.setScore((Integer) payload.get("score"));
        resume.setFeedback((String) payload.get("feedback"));
        resume.setWeakPoints((List<String>) payload.get("weakPoints"));
        resume.setGradedAt(LocalDateTime.now());

        Resume saved = resumeRepository.save(resume);
        notificationService.send(resume.getStudentId(), "RESUME",
                "Your resume has been graded! Score: " + resume.getScore() + "/100");
        return saved;
    }

    public List<Resume> getFeedback(String studentId) {
        return resumeRepository.findByStudentId(studentId);
    }

    public List<Resume> getPendingForMentor(String mentorId) {
        return resumeRepository.findByMentorIdAndGradedAtIsNull(mentorId);
    }
}
