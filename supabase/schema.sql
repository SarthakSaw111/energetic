-- ==============================================
-- ENERGETIC APP — Supabase Database Schema
-- Run this ENTIRE script in Supabase SQL Editor
-- ==============================================

-- 1. USER PROFILES
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT,
  height NUMERIC,
  start_weight NUMERIC,
  age INTEGER,
  gender TEXT DEFAULT 'male',
  goal_weight NUMERIC,
  equipment TEXT[] DEFAULT '{}',
  wake_time TEXT DEFAULT '08:00',
  sleep_time TEXT DEFAULT '00:00',
  meal_times TEXT[] DEFAULT ARRAY['09:00','13:00','17:00','21:00'],
  api_key TEXT,
  coach_type TEXT DEFAULT 'bro',
  daily_calorie_target INTEGER,
  protein_target INTEGER,
  current_phase INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DAILY LOGS (one row per user per day)
CREATE TABLE IF NOT EXISTS daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMPTZ,
  mood INTEGER,
  weight NUMERIC,
  workout_done BOOLEAN DEFAULT FALSE,
  workout_completed_at TIMESTAMPTZ,
  workout_duration INTEGER,
  workout JSONB DEFAULT NULL,
  meals JSONB DEFAULT '[]'::jsonb,
  calorie_xp_awarded BOOLEAN DEFAULT FALSE,
  all_meals_xp_awarded BOOLEAN DEFAULT FALSE,
  weight_xp_awarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 3. STREAK DATA
CREATE TABLE IF NOT EXISTS streak_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_days_active INTEGER DEFAULT 0,
  skip_days_used_this_month INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. XP DATA
CREATE TABLE IF NOT EXISTS xp_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_xp INTEGER DEFAULT 0,
  achievements JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. GALLERY (photo metadata — actual files in Supabase Storage)
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT,
  date DATE,
  journey_day INTEGER,
  ai_comment TEXT,
  tags TEXT[] DEFAULT '{}',
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CONVERSATIONS (AI chat history)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- ROW LEVEL SECURITY (each user only sees own data)
-- ==============================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Policies: users can only CRUD their own rows
CREATE POLICY "Users manage own profile" ON user_profiles
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own daily logs" ON daily_logs
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own streak" ON streak_data
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own XP" ON xp_data
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own gallery" ON gallery
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own conversations" ON conversations
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ==============================================
-- STORAGE BUCKET for progress photos
-- ==============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('progress-photos', 'progress-photos', true, 5242880)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: users upload into their own folder
CREATE POLICY "Users upload own photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'progress-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users view own photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'progress-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users delete own photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'progress-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Public read access for photo URLs
CREATE POLICY "Public photo read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'progress-photos');

-- ==============================================
-- INDEXES for performance
-- ==============================================
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON daily_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_gallery_user ON gallery(user_id, uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id, created_at DESC);

-- ==============================================
-- AUTO-UPDATE updated_at trigger
-- ==============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_profiles_updated
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_daily_logs_updated
  BEFORE UPDATE ON daily_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_streak_data_updated
  BEFORE UPDATE ON streak_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_xp_data_updated
  BEFORE UPDATE ON xp_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
