package com.mentorconnect.repository;

import com.mentorconnect.model.Doubt;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DoubtRepository extends MongoRepository<Doubt, String> {
    List<Doubt> findByMentorId(String mentorId);
    List<Doubt> findByStudentId(String studentId);
    List<Doubt> findByMentorIdAndStatus(String mentorId, String status);
    long countByStudentIdAndStatus(String studentId, String status);
}
