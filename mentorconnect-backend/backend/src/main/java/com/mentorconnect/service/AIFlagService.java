package com.mentorconnect.service;

import com.mentorconnect.model.AIFlag;
import com.mentorconnect.model.Doubt;
import com.mentorconnect.model.Message;
import com.mentorconnect.repository.AIFlagRepository;
import com.mentorconnect.repository.DoubtRepository;
import com.mentorconnect.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIFlagService {

    private final AIFlagRepository aiFlagRepository;
    private final DoubtRepository doubtRepository;
    private final MessageRepository messageRepository;
    private final MentorService mentorService;
    private final EmbeddingModel embeddingModel;

    // ── Run every hour ──
    @Scheduled(fixedDelay = 3_600_000)
    public void runFlagChecks() {
        checkSlackers();
        checkFraudMentors();
    }

    /**
     * SLACKER: student has > 20 open doubts (asked but never waited for answer OR
     * resolve rate < 10%).
     */
    private void checkSlackers() {
        doubtRepository.findAll().stream()
                .map(Doubt::getStudentId)
                .distinct()
                .forEach(studentId -> {
                    long open     = doubtRepository.countByStudentIdAndStatus(studentId, "OPEN");
                    long resolved = doubtRepository.countByStudentIdAndStatus(studentId, "RESOLVED");
                    long total    = open + resolved;

                    if (total > 20 && (total == 0 || (double) resolved / total < 0.10)) {
                        flagUser(studentId, "SLACKER",
                                "High doubt count with <10% resolution engagement", 0.85);
                    }
                });
    }

    /**
     * FRAUD MENTOR: last 10 answers have pairwise cosine similarity > 0.85
     * (same generic reply copy-pasted).
     */
    private void checkFraudMentors() {
        doubtRepository.findAll().stream()
                .filter(d -> "RESOLVED".equals(d.getStatus()) && d.getAnswer() != null)
                .map(Doubt::getMentorId)
                .distinct()
                .forEach(mentorId -> {
                    List<Doubt> resolved = doubtRepository.findByMentorId(mentorId).stream()
                            .filter(d -> "RESOLVED".equals(d.getStatus()))
                            .toList();

                    if (resolved.size() < 5) return;

                    List<String> answers = resolved.stream()
                            .map(Doubt::getAnswer)
                            .filter(a -> a != null && !a.isBlank())
                            .toList()
                            .subList(Math.max(0, resolved.size() - 10), resolved.size());

                    double avgSimilarity = computeAvgPairwiseSimilarity(answers);
                    if (avgSimilarity > 0.85) {
                        flagUser(mentorId, "FRAUD",
                                "Generic copy-paste replies detected (avg similarity " +
                                String.format("%.2f", avgSimilarity) + ")", avgSimilarity);
                        mentorService.flagFraud(mentorId);
                    }
                });
    }

    private double computeAvgPairwiseSimilarity(List<String> texts) {
        if (texts.size() < 2) return 0;
        List<float[]> vecs = texts.stream()
                .map(embeddingModel::embed)
                .toList();
        double sum = 0; int count = 0;
        for (int i = 0; i < vecs.size(); i++) {
            for (int j = i + 1; j < vecs.size(); j++) {
                sum += cosineSimilarity(vecs.get(i), vecs.get(j));
                count++;
            }
        }
        return count == 0 ? 0 : sum / count;
    }

    private double cosineSimilarity(float[] a, float[] b) {
        double dot = 0, normA = 0, normB = 0;
        int len = Math.min(a.length, b.length);
        for (int i = 0; i < len; i++) {
            dot += a[i] * b[i]; normA += a[i] * a[i]; normB += b[i] * b[i];
        }
        return normA == 0 || normB == 0 ? 0 : dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    private void flagUser(String userId, String type, String reason, double confidence) {
        boolean alreadyFlagged = !aiFlagRepository
                .findByUserIdAndFlagType(userId, type).isEmpty();
        if (alreadyFlagged) return;

        AIFlag flag = new AIFlag();
        flag.setUserId(userId);
        flag.setFlagType(type);
        flag.setReason(reason);
        flag.setConfidenceScore(confidence);
        aiFlagRepository.save(flag);
        log.info("AI flagged user {} as {} — {}", userId, type, reason);
    }

    public List<AIFlag> getFlagsForUser(String userId) {
        return aiFlagRepository.findByUserId(userId);
    }
}
