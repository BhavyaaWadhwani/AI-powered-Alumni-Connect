# MentorConnect — Backend

Spring Boot 3.2 + MongoDB + Spring Security (JWT) + WebSocket (STOMP) + Spring AI

## Setup

```bash
# Prerequisites: Java 17+, Maven, MongoDB running locally
cp .env.example .env
# Edit .env with your values

mvn spring-boot:run -Dspring-boot.run.profiles=dev
# Server starts at http://localhost:8080
```

## File Structure

```
src/main/java/com/mentorconnect/
├── MentorConnectApplication.java     # Entry point + @EnableScheduling
│
├── model/                            # MongoDB documents (@Document)
│   ├── User.java
│   ├── Mentor.java
│   ├── Message.java
│   ├── Doubt.java
│   ├── Resume.java
│   ├── AIFlag.java
│   └── Notification.java
│
├── repository/                       # MongoRepository interfaces
│   ├── UserRepository.java
│   ├── MentorRepository.java
│   ├── DoubtRepository.java
│   ├── MessageRepository.java
│   ├── ResumeRepository.java
│   ├── AIFlagRepository.java
│   └── NotificationRepository.java
│
├── service/                          # Business logic
│   ├── AuthService.java              # Register, login, JWT issue
│   ├── MentorService.java            # Search, profile, popularity
│   ├── DoubtService.java             # Create, resolve, +points
│   ├── ChatService.java              # Save + WebSocket broadcast
│   ├── ResumeService.java            # Upload (GridFS), grade
│   ├── NotificationService.java      # Event-driven + WS push
│   ├── AIRecommendationService.java  # Embedding + cosine match
│   └── AIFlagService.java            # Slacker + fraud detection (scheduled)
│
├── controller/                       # REST + WebSocket endpoints
│   ├── AuthController.java           # POST /api/auth/register|login
│   ├── MentorController.java         # GET /api/mentors/search|{id}
│   ├── StudentController.java        # GET/PUT /api/students
│   ├── DoubtController.java          # POST/GET/PUT /api/doubts
│   ├── ResumeController.java         # POST /api/resumes/upload|grade
│   ├── ChatController.java           # WS @MessageMapping + REST history
│   ├── AIController.java             # POST /api/ai/recommend|flags
│   └── NotificationController.java   # GET/PUT /api/notifications
│
├── security/
│   ├── JwtTokenProvider.java         # Generate + validate JWT
│   ├── JwtAuthFilter.java            # OncePerRequestFilter
│   └── SecurityConfig.java           # Filter chain + role rules
│
└── config/
    ├── WebSocketConfig.java          # STOMP broker + /ws endpoint
    ├── CorsConfig.java               # Allow React origin
    ├── MongoConfig.java              # GridFS bucket setup
    └── AIConfig.java                 # Spring AI beans
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Register student or mentor |
| POST | /api/auth/login | — | Login, get JWT |
| GET | /api/mentors/search | — | Search with filters |
| GET | /api/mentors/{id} | — | Mentor profile |
| PUT | /api/mentors/profile | MENTOR | Update own profile |
| POST | /api/doubts | STUDENT | Ask a doubt |
| GET | /api/doubts | MENTOR | Doubt inbox |
| PUT | /api/doubts/{id}/resolve | MENTOR | Resolve + earn points |
| POST | /api/resumes/upload | STUDENT | Upload PDF |
| POST | /api/resumes/{id}/grade | MENTOR | Grade + feedback |
| GET | /api/chat/history/{peerId} | ANY | Chat history |
| WS | /ws → /app/chat.send | ANY | Real-time message |
| POST | /api/ai/recommend | STUDENT | AI mentor suggestions |
| GET | /api/notifications | ANY | User notifications |
