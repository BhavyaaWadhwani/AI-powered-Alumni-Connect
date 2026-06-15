# MentorConnect — Frontend

React 18 + Vite + Redux Toolkit + Tailwind CSS

## Setup

```bash
npm install
cp .env.example .env
# Edit .env → set VITE_API_URL to your Spring Boot server
npm run dev
```

## File Structure

```
src/
├── pages/           # 10 route pages
│   ├── HomePage.jsx
│   ├── RegisterPage.jsx
│   ├── LoginPage.jsx
│   ├── MentorSearchPage.jsx
│   ├── MentorProfilePage.jsx
│   ├── StudentDashboard.jsx
│   ├── MentorDashboard.jsx
│   ├── ChatPage.jsx
│   ├── DoubtPage.jsx
│   ├── ResumeReviewPage.jsx
│   └── OnboardingPage.jsx
├── components/
│   └── index.jsx    # All shared components: Navbar, ChatBox, MentorCard,
│                    # DoubtThread, ResumeUploader, ResumeGrader, AIOnboarding,
│                    # NotificationBell, MentorFilter, PopularityBadge, FlagBadge
├── store/
│   ├── store.js
│   ├── authSlice.js
│   ├── mentorSlice.js
│   ├── chatSlice.js
│   └── aiSlice.js
├── services/
│   └── apiService.js  # authApi, mentorApi, chatApi, aiApi, resumeApi, doubtApi
├── utils/
│   ├── useTheme.js    # ThemeProvider, useTheme hook, tok() color tokens
│   └── websocket.js   # STOMP WebSocket client
├── styles/
│   └── global.css     # CSS variables (dark + light), keyframes, resets
├── App.jsx            # Router + ProtectedRoute
└── main.jsx           # Entry point
```

## Theme

Toggle between dark and light mode via the ☽/☀ button in the navbar.  
Theme is persisted in `localStorage` under key `mc-theme`.  
Color tokens are defined in `src/utils/useTheme.js` → `tok(isDark)`.

## Key Features
- AI-powered mentor recommendations (onboarding wizard)
- 1-on-1 real-time chat via WebSocket (STOMP/SockJS)
- Resume upload + mentor grading with weak point highlights
- Threaded doubt Q&A system
- Popularity scoring for mentors
- AI fraud/slacker flag badges
- Dark ↔ Light theme toggle
