-- ==============================================================================
-- IT Courses - Supabase Database Schema
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Profiles Table (linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert/update their own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. Learner State Table (Stores course progress, quiz results, DSA solutions)
CREATE TABLE IF NOT EXISTS public.learner_state (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  courses JSONB DEFAULT '{}'::jsonb NOT NULL,
  certificates JSONB DEFAULT '{}'::jsonb NOT NULL,
  solved_dsa_ids JSONB DEFAULT '[]'::jsonb NOT NULL,
  dsa_drafts JSONB DEFAULT '{}'::jsonb NOT NULL,
  flashcard_mastered JSONB DEFAULT '[]'::jsonb NOT NULL,
  activity_dates JSONB DEFAULT '[]'::jsonb NOT NULL,
  study_minutes INTEGER DEFAULT 0 NOT NULL,
  last_active_course_slug TEXT,
  last_active_lesson_id TEXT,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.learner_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own learner state"
  ON public.learner_state FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Public Certificates Table (Allows public verification by certificate ID)
CREATE TABLE IF NOT EXISTS public.public_certificates (
  id TEXT PRIMARY KEY, -- e.g. ITC-2026-HTML-9C4E21
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  course_slug TEXT NOT NULL,
  course_title TEXT NOT NULL,
  course_area TEXT NOT NULL,
  learner_name TEXT NOT NULL,
  level_label TEXT NOT NULL,
  final_score NUMERIC NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.public_certificates ENABLE ROW LEVEL SECURITY;

-- Allow ANYONE (including anonymous visitors) to verify valid certificates
CREATE POLICY "Public read access for certificates"
  ON public.public_certificates FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to publish/record their earned certificates
CREATE POLICY "Authenticated users can record their own certificates"
  ON public.public_certificates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_public_certificates_id ON public.public_certificates(id);
