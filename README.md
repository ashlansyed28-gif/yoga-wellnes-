# Prana — Yoga & Mind Wellness Platform

A modern, production-grade Yoga & Mind Wellness web application designed to restore mental and physical equilibrium through personalized daily plans, multimodal AI pose correction, emergency calm modes, and certified expert consultations.

---

## 🌟 Key Features

1. **User Onboarding & Profiling (`/onboarding`)**: Multi-step intake capturing experience level, daily time availability, and tailored wellness goals.
2. **Personalized Wellness Plan (Gemini AI)**: Auto-generated daily rituals dynamically dividing minutes across yoga, breathwork, and meditation.
3. **Home Dashboard (`/dashboard`)**: Time-adaptive greetings, today's routine checklist, streak tracking, and quick-action triggers.
4. **Online Yoga Library (`/yoga`)**: Categorized VOD directory (Morning, Evening, Back & Neck, Office/Chair, Flexibility, Strength) with interactive practice timers.
5. **Specialized Health Protocols (`/yoga/protocols`)**: Clinically-informed routines for Spine Care, Stress Recovery, and Joint Ease with permanent medical disclaimers.
6. **AI Yoga Pose Alignment Studio (`/yoga/pose-correction`)**: Privacy-first, webcam-enabled multimodal vision analyzing user poses and returning positive reinforcement (✅) and gentle alignment cues (⚠️).
7. **Emergency Calm Mode (`/calm`)**: 1-click rapid reset with an interactive Breathing Visualizer (4-7-8, Box Breathing, 4-6 Vagal Grounding) and 5-4-3-2-1 Sensory Grounding.
8. **Meditation & Sleep Sanctuary (`/meditation`, `/sleep`)**: In-browser Web Audio soundscapes (Rain, Ocean surf, Forest breeze, Tibetan singing bowl chimes) and bedtime somatic flows.
9. **Face Yoga & TMJ Release (`/face-yoga`)**: Step-by-step facial relaxation routines with optional local mirror camera feed.
10. **Expert Directory & Consultations (`/consult`)**: Verified practitioners directory with interactive booking, slot selection, and non-medical acknowledgment.
11. **Wellness Tracker & Milestones (`/progress`)**: 7-day consistency chart, discipline distribution, and unlocked gamification badges.
12. **Empathetic AI Wellness Assistant (Prana AI)**: Context-aware chat assistant with strict non-medical guardrails and permanent disclaimers.
13. **Community Feed (`/community`)**: Moderated peer reflections, group categories, and compassionate interactions.
14. **User Profile & Privacy Controls (`/profile`)**: Manage preferences, toggle practice reminders, and export wellness data (.JSON).

---

## 🛠 Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router v6, Zod, Web Audio API
- **Backend**: Node.js, Express.js (REST API architecture), Morgan, CORS, Express Rate Limit
- **Database & Auth**: PostgreSQL, Supabase Auth, Row Level Security (RLS)
- **AI Integration**: Google Gen AI SDK (`@google/genai`) for structured daily planning, multimodal pose correction, and serene conversational guidance.
- **Validation**: Strict Zod schemas validating all API inputs.

---

## 📁 Repository Structure

```text
/yoga-mind-wellness
  ├── /backend
  │     ├── /src
  │     │     ├── /controllers
  │     │     │     ├── aiController.js
  │     │     │     ├── communityController.js
  │     │     │     ├── dashboardController.js
  │     │     │     ├── expertsController.js
  │     │     │     ├── onboardingController.js
  │     │     │     └── sessionsController.js
  │     │     ├── /middleware
  │     │     │     ├── auth.js          # Supabase JWT & Demo Session
  │     │     │     └── validate.js      # Zod validation middleware
  │     │     ├── /routes
  │     │     │     └── api.js           # REST API Routes with Rate Limiting
  │     │     ├── /services
  │     │     │     ├── dbService.js     # Supabase DB + In-Memory Fallback
  │     │     │     └── geminiService.js # @google/genai SDK Integration
  │     │     └── server.js
  │     ├── .env
  │     ├── package.json
  │     └── schema.sql                   # Full Supabase PostgreSQL schema with RLS
  ├── /frontend
  │     ├── /src
  │     │     ├── /components
  │     │     │     ├── AIAssistantDrawer.jsx
  │     │     │     ├── AmbientSoundPlayer.jsx
  │     │     │     ├── BottomNav.jsx
  │     │     │     ├── BreathingVisualizer.jsx
  │     │     │     ├── EmergencyCalmButton.jsx
  │     │     │     ├── ExpertProfileCard.jsx
  │     │     │     ├── MedicalDisclaimer.jsx
  │     │     │     ├── PoseCameraViewer.jsx
  │     │     │     ├── ProgressRing.jsx
  │     │     │     ├── TopNav.jsx
  │     │     │     ├── WeeklyChart.jsx
  │     │     │     └── WellnessCard.jsx
  │     │     ├── /context
  │     │     │     └── AuthContext.jsx
  │     │     ├── /lib
  │     │     │     ├── api.js
  │     │     │     ├── audioSynth.js    # Web Audio API Soundscapes
  │     │     │     └── supabase.js
  │     │     ├── /pages
  │     │     │     ├── CalmPage.jsx
  │     │     │     ├── CommunityPage.jsx
  │     │     │     ├── ConsultPage.jsx
  │     │     │     ├── DashboardPage.jsx
  │     │     │     ├── FaceYogaPage.jsx
  │     │     │     ├── LandingPage.jsx
  │     │     │     ├── MeditationPage.jsx
  │     │     │     ├── OnboardingPage.jsx
  │     │     │     ├── PoseCorrectionPage.jsx
  │     │     │     ├── ProfilePage.jsx
  │     │     │     ├── ProgressPage.jsx
  │     │     │     ├── ProtocolsPage.jsx
  │     │     │     ├── SleepPage.jsx
  │     │     │     └── YogaLibraryPage.jsx
  │     │     ├── App.jsx
  │     │     ├── index.css
  │     │     └── main.jsx
  │     ├── .env
  │     ├── index.html
  │     ├── package.json
  │     ├── tailwind.config.js
  │     └── vite.config.js
  └── README.md
```

---

## 🚀 Getting Started

### 1. Backend Setup & Run

```bash
cd backend
# Dependencies are already installed
node src/server.js
```
The server will run on `http://localhost:5000`.

### 2. Frontend Setup & Run

```bash
cd frontend
# Dependencies are already installed
corepack pnpm run dev
```
The application will launch on `http://localhost:3000`.

---

## 🗄️ Database Setup (Supabase / PostgreSQL)

1. Open your Supabase Dashboard -> **SQL Editor**.
2. Copy and paste the contents of `backend/schema.sql`.
3. Click **Run** to generate the tables (`profiles`, `daily_plans`, `completed_sessions`, `experts`, `consultations`, `community_posts`), enable Row Level Security (RLS), and seed the initial expert practitioners.
