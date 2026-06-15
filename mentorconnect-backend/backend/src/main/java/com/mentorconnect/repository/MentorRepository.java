package com.mentorconnect.repository;

import com.mentorconnect.model.Mentor;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MentorRepository extends MongoRepository<Mentor, String> {
    List<Mentor> findByCompanyContainingIgnoreCase(String company);
    List<Mentor> findBySkillsIn(List<String> skills);
    List<Mentor> findTop10ByOrderByPopularityScoreDesc();
    List<Mentor> findByFraudFlagFalseOrderByPopularityScoreDesc();
}
