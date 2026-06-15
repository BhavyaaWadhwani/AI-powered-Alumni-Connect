package com.mentorconnect.repository;

import com.mentorconnect.model.AIFlag;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface AIFlagRepository extends MongoRepository<AIFlag, String> {
    List<AIFlag> findByUserId(String userId);
    List<AIFlag> findByUserIdAndFlagType(String userId, String flagType);
    List<AIFlag> findByCreatedAtAfter(LocalDateTime after);
}
