/**
 * MentorConnect — Seed Data Script
 * Run with: mongosh mentorconnect seed.js
 *
 * Inserts sample users, mentors, doubts, resumes for local testing.
 * Passwords below are placeholders — in real app, passwordHash is BCrypt output.
 */

db = db.getSiblingDB("mentorconnect");

// ── Clear existing data (careful in production!) ──
db.users.deleteMany({});
db.mentors.deleteMany({});
db.doubts.deleteMany({});
db.resumes.deleteMany({});
db.messages.deleteMany({});
db.ai_flags.deleteMany({});
db.notifications.deleteMany({});

// ── Sample mentors (also need a corresponding users doc) ──
const mentor1Id = ObjectId();
const mentor2Id = ObjectId();
const mentor3Id = ObjectId();

db.users.insertMany([
  {
    _id: mentor1Id,
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    passwordHash: "$2a$10$examplehash1",
    role: "MENTOR",
    interests: [],
    slackerFlag: false,
    flagCount: 0,
    createdAt: new Date()
  },
  {
    _id: mentor2Id,
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    passwordHash: "$2a$10$examplehash2",
    role: "MENTOR",
    interests: [],
    slackerFlag: false,
    flagCount: 0,
    createdAt: new Date()
  },
  {
    _id: mentor3Id,
    name: "Rohit Verma",
    email: "rohit.verma@example.com",
    passwordHash: "$2a$10$examplehash3",
    role: "MENTOR",
    interests: [],
    slackerFlag: false,
    flagCount: 0,
    createdAt: new Date()
  }
]);

db.mentors.insertMany([
  {
    _id: mentor1Id,
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    company: "Google",
    role: "SWE",
    skills: ["DSA", "System Design", "Java"],
    achievements: ["Solved 800+ LeetCode problems", "Mentored 50+ students"],
    popularityScore: 880,
    resolvedDoubtCount: 88,
    fraudFlag: false,
    reviewList: []
  },
  {
    _id: mentor2Id,
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    company: "Microsoft",
    role: "ML Engineer",
    skills: ["ML", "Python", "Resume Review"],
    achievements: ["Published 3 ML research papers", "Ex-Google intern"],
    popularityScore: 740,
    resolvedDoubtCount: 74,
    fraudFlag: false,
    reviewList: []
  },
  {
    _id: mentor3Id,
    name: "Rohit Verma",
    email: "rohit.verma@example.com",
    company: "Amazon",
    role: "SDE-2",
    skills: ["Spring Boot", "Backend", "AWS"],
    achievements: ["Built scalable microservices at Amazon"],
    popularityScore: 620,
    resolvedDoubtCount: 62,
    fraudFlag: false,
    reviewList: []
  }
]);

// ── Sample student ──
const student1Id = ObjectId();

db.users.insertOne({
  _id: student1Id,
  name: "Siddharth M.",
  email: "siddharth@example.com",
  passwordHash: "$2a$10$examplehash4",
  role: "STUDENT",
  college: "NIT Trichy",
  interests: ["DSA", "System Design"],
  slackerFlag: false,
  flagCount: 0,
  createdAt: new Date()
});

// ── Sample doubt ──
db.doubts.insertOne({
  studentId: student1Id.str,
  studentName: "Siddharth M.",
  mentorId: mentor3Id.str,
  question: "How to optimize LRU cache implementation in Java?",
  answer: null,
  status: "OPEN",
  isDuplicate: false,
  createdAt: new Date()
});

db.doubts.insertOne({
  studentId: student1Id.str,
  studentName: "Siddharth M.",
  mentorId: mentor3Id.str,
  question: "Difference between ArrayList and LinkedList?",
  answer: "ArrayList uses a dynamic array (O(1) random access, O(n) insert/delete in middle). LinkedList uses doubly-linked nodes (O(1) insert/delete at ends, O(n) random access). Use ArrayList for frequent reads, LinkedList for frequent insertions/deletions.",
  status: "RESOLVED",
  isDuplicate: false,
  createdAt: new Date(Date.now() - 86400000)
});

// ── Sample resume ──
db.resumes.insertOne({
  studentId: student1Id.str,
  studentName: "Siddharth M.",
  mentorId: mentor3Id.str,
  fileUrl: "/files/siddharth_resume.pdf",
  score: 68,
  weakPoints: [
    "No quantified achievements in project section",
    "Missing relevant keywords for backend roles",
    "Summary section too generic"
  ],
  feedback: "Good foundation. Add metrics to your projects (e.g. 'reduced API latency by 30%'). Tailor skills section to match target job descriptions.",
  uploadedAt: new Date(Date.now() - 172800000),
  gradedAt: new Date(Date.now() - 86400000)
});

print("✅ Seed data inserted successfully.");
print(`Mentor IDs: ${mentor1Id}, ${mentor2Id}, ${mentor3Id}`);
print(`Student ID: ${student1Id}`);
