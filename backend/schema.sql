-- ============================================================================
-- YOGA & MIND WELLNESS PLATFORM - PRODUCTION POSTGRESQL & SUPABASE SCHEMA
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  experience_level TEXT CHECK (experience_level IN ('Beginner', 'Intermediate', 'Advanced')),
  daily_available_minutes INTEGER DEFAULT 20,
  goals TEXT[] DEFAULT '{}',
  preferred_language TEXT DEFAULT 'English',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Daily Plans Table
CREATE TABLE IF NOT EXISTS daily_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  yoga_minutes INTEGER DEFAULT 10,
  meditation_minutes INTEGER DEFAULT 5,
  breathing_minutes INTEGER DEFAULT 5,
  plan_summary TEXT,
  recommended_routine JSONB DEFAULT '[]'::jsonb,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Completed Sessions Table
CREATE TABLE IF NOT EXISTS completed_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_type TEXT CHECK (session_type IN ('Yoga', 'Meditation', 'Breathing', 'Face Yoga', 'Sleep')),
  duration_minutes INTEGER NOT NULL,
  pose_feedback JSONB DEFAULT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Experts Directory
CREATE TABLE IF NOT EXISTS experts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_url TEXT,
  qualifications TEXT,
  specialization TEXT,
  hourly_rate NUMERIC DEFAULT 60,
  languages TEXT[] DEFAULT '{"English"}',
  rating NUMERIC DEFAULT 4.9,
  reviews_count INTEGER DEFAULT 34,
  bio TEXT,
  available_slots TEXT[] DEFAULT '{"09:00 AM", "11:30 AM", "03:00 PM", "05:30 PM", "07:00 PM"}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Consultations Table
CREATE TABLE IF NOT EXISTS consultations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  expert_id UUID REFERENCES experts(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')) DEFAULT 'Confirmed',
  notes TEXT,
  disclaimer_acknowledged BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Community Feed & Support Groups
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  group_category TEXT NOT NULL DEFAULT 'Mindfulness & Serenity',
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Daily Plans Policies
CREATE POLICY "Users can manage their own daily plans"
  ON daily_plans FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Completed Sessions Policies
CREATE POLICY "Users can manage their own completed sessions"
  ON completed_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Experts Policies (Public Read, Admin Write)
CREATE POLICY "Anyone can view experts"
  ON experts FOR SELECT
  USING (true);

-- Consultations Policies
CREATE POLICY "Users can view their own consultations"
  ON consultations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can book consultations"
  ON consultations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consultations"
  ON consultations FOR UPDATE
  USING (auth.uid() = user_id);

-- Community Posts Policies
CREATE POLICY "Anyone can view community posts"
  ON community_posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create community posts"
  ON community_posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR user_id = auth.uid());

CREATE POLICY "Users can update their own community posts"
  ON community_posts FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- SEED INITIAL EXPERT DATA
-- ============================================================================

INSERT INTO experts (name, avatar_url, qualifications, specialization, hourly_rate, languages, rating, reviews_count, bio, available_slots)
VALUES
(
  'Dr. Ananya Sharma',
  'https://images.unsplash.com/photo-1594824813589-3221e6498877?auto=format&fit=crop&q=80&w=400',
  'MD in Holistic Medicine, 500-hr E-RYT Yoga Therapist',
  'Therapeutic Hatha, Spine Alignment & Stress Recovery',
  85,
  ARRAY['English', 'Hindi', 'Sanskrit'],
  4.98,
  128,
  '14+ years integrating authentic Vedic yoga philosophies with biomechanics for restorative posture and chronic back care.',
  ARRAY['09:00 AM', '11:00 AM', '02:30 PM', '04:30 PM', '06:30 PM']
),
(
  'Julian Vance',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  'MA in Mindfulness Studies, MBSR Certified Instructor',
  'Vipassana, Box Breathing & Somatic Stress Release',
  75,
  ARRAY['English', 'French'],
  4.95,
  94,
  'Specialist in down-regulating the sympathetic nervous system through clinically-backed somatic grounding and sleep conditioning.',
  ARRAY['08:30 AM', '10:30 AM', '01:00 PM', '03:30 PM', '07:00 PM']
),
(
  'Mei-Ling Chen',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  'Certified Face Yoga Method Coach, Acupressure Practitioner',
  'Facial Rejuvenation, TMJ/Jaw Release & Lymphatic Flow',
  70,
  ARRAY['English', 'Mandarin'],
  4.92,
  76,
  'Pioneer of non-invasive facial neuromuscular toning, dedicated to easing tension headaches and boosting natural skin circulation.',
  ARRAY['10:00 AM', '12:00 PM', '02:00 PM', '05:00 PM']
),
(
  'Aarav Patel',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
  'Ashtanga Vinyasa Authorized Teacher, Sports Physiologist',
  'Dynamic Flow, Joint Mobility & Office Ergonomics',
  80,
  ARRAY['English', 'Gujarati'],
  4.96,
  112,
  'Focuses on desk workers and athletes seeking pain-free hip opening, shoulder mobility, and active mindful recovery routines.',
  ARRAY['07:30 AM', '09:30 AM', '12:30 PM', '04:00 PM', '06:00 PM']
)
ON CONFLICT DO NOTHING;
