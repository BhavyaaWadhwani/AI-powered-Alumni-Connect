/**
 * MentorConnect — MongoDB Index Creation Script
 *
 * Run with: mongosh mentorconnect create-indexes.js
 * Or paste into MongoDB Compass / Atlas shell.
 *
 * Why these indexes:
 * - users.email        → unique login lookup (fast + enforces uniqueness)
 * - mentors compound   → search filters (company + skills + popularity sort)
 * - messages compound  → fast 1-on-1 conversation history fetch
 * - doubts.mentorId    → mentor's doubt inbox query
 * - doubts.studentId   → student's "my doubts" query
 * - resumes.studentId  → student's resume feedback query
 * - resumes.mentorId+gradedAt → mentor's pending resume queue
 * - ai_flags.userId    → quick flag lookup per user
 * - notifications.recipientId+timestamp → notification feed, newest first
 */

db = db.getSiblingDB("mentorconnect");

// ── users ──
db.users.createIndex({ email: 1 }, { unique: true, name: "uniq_email" });
db.users.createIndex({ role: 1 }, { name: "idx_role" });
db.users.createIndex({ slackerFlag: 1 }, { name: "idx_slacker_flag" });

// ── mentors ──
db.mentors.createIndex(
  { company: 1, skills: 1, popularityScore: -1 },
  { name: "idx_company_skills_popularity" }
);
db.mentors.createIndex({ fraudFlag: 1, popularityScore: -1 }, { name: "idx_fraud_popularity" });

// ── messages ──
db.messages.createIndex(
  { senderId: 1, receiverId: 1, timestamp: 1 },
  { name: "idx_conversation" }
);
db.messages.createIndex(
  { receiverId: 1, senderId: 1, timestamp: 1 },
  { name: "idx_conversation_reverse" }
);

// ── doubts ──
db.doubts.createIndex({ mentorId: 1, status: 1 }, { name: "idx_mentor_status" });
db.doubts.createIndex({ studentId: 1, status: 1 }, { name: "idx_student_status" });
db.doubts.createIndex({ createdAt: -1 }, { name: "idx_doubt_recent" });

// ── resumes ──
db.resumes.createIndex({ studentId: 1 }, { name: "idx_resume_student" });
db.resumes.createIndex(
  { mentorId: 1, gradedAt: 1 },
  { name: "idx_resume_pending_queue" }
);

// ── ai_flags ──
db.ai_flags.createIndex({ userId: 1, flagType: 1 }, { name: "idx_flag_user_type" });
db.ai_flags.createIndex({ createdAt: -1 }, { name: "idx_flag_recent" });

// ── notifications ──
db.notifications.createIndex(
  { recipientId: 1, timestamp: -1 },
  { name: "idx_notif_recipient_recent" }
);
db.notifications.createIndex(
  { recipientId: 1, read: 1 },
  { name: "idx_notif_unread" }
);

print("✅ All indexes created successfully.");
