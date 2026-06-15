# AI-powered-Alumni-Connect
# MentorConnect

MentorConnect is a mentorship platform built to solve a real problem students face during internship and placement season: there's plenty of advice floating around, but very little of it comes from someone who's actually been through the exact process at the company you're targeting. The platform lets students register, share their interests and goals, and get matched — by AI — with senior mentors who are already working at companies like Google, Microsoft, or Amazon. Once matched, students can chat 1-on-1 with a mentor, ask specific doubts, and send their resume for review, all within the same platform instead of scattered across cold DMs and group chats.

What sets MentorConnect apart is the trust and accountability layer running quietly underneath. Every resolved doubt earns a mentor popularity points, building a visible reputation score. On the other side, an AI system continuously monitors activity — flagging students who repeatedly ask doubts without engaging (slackers), and flagging mentors who give generic, copy-pasted responses (fraud). Resumes are graded with a numeric score and specific weak points highlighted in red, so students know exactly what to fix. The result is a self-correcting ecosystem where good mentorship is rewarded and low-effort behavior on either side gets surfaced automatically.

## Tech Stack

**Frontend** — React 18 (Vite), React Router v6, Redux Toolkit, Axios, Tailwind CSS, STOMP/SockJS for WebSocket chat, dark/light theme toggle via custom hook + CSS variables.

**Backend** — Java 17, Spring Boot 3.2 (Web, Security, WebSocket, Data MongoDB), JWT-based authentication (jjwt), Spring AI with OpenAI (chat + embeddings) for mentor recommendations and fraud/slacker detection.

**Database** — MongoDB, 7 collections (`users`, `mentors`, `messages`, `doubts`, `resumes`, `ai_flags`, `notifications`), with JSON Schema validators and performance indexes.

**Real-time** — WebSocket over STOMP/SockJS for 1-on-1 chat and live notifications.

## How to Use

### 1. Set up the database
```bash
# Start MongoDB locally (or use a MongoDB Atlas connection string)
mongod --dbpath /data/db

# Create indexes
mongosh mentorconnect database/indexes/create-indexes.js

# (Optional) Load sample data for testing
mongosh mentorconnect database/seed-data/seed.js
```

### 2. Run the backend
```bash
cd backend
cp .env.example .env
# Edit .env → set MONGODB_URI, JWT_SECRET, OPENAI_API_KEY

mvn spring-boot:run -Dspring-boot.run.profiles=dev
# Server runs at http://localhost:8080
```

### 3. Run the frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env → set VITE_API_URL=http://localhost:8080

npm run dev
# App runs at http://localhost:3000
```

### 4. Try it out
- Register as a **Student** → complete the AI onboarding (interests, target companies, goals) → get matched mentors.
- Register as a **Mentor** → fill in company, role, and skills → start appearing in student search results.
- As a student, browse mentors, view profiles, and click **Connect** to start a 1-on-1 chat.
- Ask a doubt from the doubt page — the mentor resolves it and earns popularity points.
- Upload a resume (PDF) — the mentor grades it with a score and highlights weak points.
- Toggle dark/light mode using the ☽/☀ button in the navbar — preference is saved automatically.

## Project Structure
```
mentorconnect/
├── frontend/    → React app (pages, components, store, services, styles)
├── backend/     → Spring Boot app (models, controllers, services, repositories, security, config)
└── database/    → MongoDB schemas, indexes, and seed data
```

Each folder has its own README with a detailed file-by-file breakdown.
