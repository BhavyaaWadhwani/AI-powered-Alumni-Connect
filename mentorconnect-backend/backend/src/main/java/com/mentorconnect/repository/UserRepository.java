package com.mentorconnect.repository;

import com.mentorconnect.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(String role);
    List<User> findBySlackerFlagTrue();
    boolean existsByEmail(String email);
}
