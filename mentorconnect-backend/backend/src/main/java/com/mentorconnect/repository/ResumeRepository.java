package com.mentorconnect.repository;

import com.mentorconnect.model.Resume;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ResumeRepository extends MongoRepository<Resume, String> {
    List<Resume> findByStudentId(String studentId);
    List<Resume> findByMentorId(String mentorId);
    List<Resume> findByMentorIdAndGradedAtIsNull(String mentorId);
}
