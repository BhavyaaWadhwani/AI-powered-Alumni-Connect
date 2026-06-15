# MentorConnect — Database (MongoDB)

MongoDB doesn't use SQL DDL files — schema is enforced two ways:
1. **Java model classes** (`@Document` annotations in backend `model/` folder) — the real source of truth
2. **JSON Schema validators** (this folder) — optional DB-level validation + documentation

## Folder Structure

```
database/
├── schema-docs/              # JSON Schema definitions (1 per collection)
│   ├── users.schema.json
│   ├── mentors.schema.json
│   ├── messages.schema.json
│   ├── doubts.schema.json
│   ├── resumes.schema.json
│   ├── ai_flags.schema.json
│   └── notifications.schema.json
│
├── indexes/
│   ├── create-indexes.js     # Performance indexes for all collections
│   └── apply-validators.js   # Applies schema validators to MongoDB
│
└── seed-data/
    └── seed.js                # Sample data for local development/testing
```

## Collections Overview

| Collection | Purpose | Key Fields |
|---|---|---|
| `users` | All accounts (students + mentors) | email (unique), role, interests, slackerFlag |
| `mentors` | Mentor-specific profile (same _id as users) | company, skills, popularityScore, fraudFlag |
| `messages` | 1-on-1 chat messages | senderId, receiverId, content/fileUrl, timestamp |
| `doubts` | Student questions + mentor answers | studentId, mentorId, question, answer, status |
| `resumes` | Resume uploads + grading | studentId, mentorId, score, weakPoints, feedback |
| `ai_flags` | AI-detected slacker/fraud flags | userId, flagType, reason, confidenceScore |
| `notifications` | In-app notifications | recipientId, type, message, read |

## Setup

```bash
# 1. Start MongoDB locally (or use Atlas connection string)
mongod --dbpath /data/db

# 2. Create indexes (recommended before going to production)
mongosh mentorconnect indexes/create-indexes.js

# 3. (Optional) Apply schema validators
mongosh mentorconnect indexes/apply-validators.js

# 4. (Optional) Load sample data for testing
mongosh mentorconnect seed-data/seed.js
```

## Relationships (no foreign keys in MongoDB — enforced in application code)

```
users (1) ──── (1) mentors        [same _id when role=MENTOR]
users (1) ──── (N) doubts          [studentId]
mentors (1) ── (N) doubts          [mentorId]
users (1) ──── (N) resumes         [studentId]
mentors (1) ── (N) resumes         [mentorId]
users (1) ──── (N) messages        [senderId / receiverId]
users (1) ──── (N) ai_flags        [userId]
users (1) ──── (N) notifications   [recipientId]
```

## Index Rationale

| Index | Why |
|---|---|
| `users.email` (unique) | Login lookup + prevents duplicate accounts |
| `mentors.company+skills+popularityScore` | Powers the search/filter page |
| `messages` compound (both directions) | Fast chat history fetch for 1-on-1 conversations |
| `doubts.mentorId+status` | Mentor's "open doubts" inbox query |
| `doubts.studentId+status` | Student's "my doubts" page |
| `resumes.mentorId+gradedAt` | Mentor's pending resume review queue |
| `ai_flags.userId+flagType` | Quick check before re-flagging same user |
| `notifications.recipientId+timestamp` | Notification feed sorted newest-first |
