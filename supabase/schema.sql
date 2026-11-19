-- ==============================================================================
-- IT Courses - Dedicated Tables for Existing Supabase Project ("My Library")
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/xflvrwxzyobmkpqvhjkf/sql
--
-- These tables are prefixed with `it_courses_` so they will NOT collide
-- or interfere with any of your existing tables in "My Library".
-- ==============================================================================

-- 1. Profiles Table for IT Courses
CREATE TABLE IF NOT EXISTS public.it_courses_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.it_courses_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own IT Courses profile"
  ON public.it_courses_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can manage their own IT Courses profile"
  ON public.it_courses_profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. Learner State Table (Stores course progress, quiz results, DSA solutions)
CREATE TABLE IF NOT EXISTS public.it_courses_learner_state (
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

ALTER TABLE public.it_courses_learner_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own IT Courses learner state"
  ON public.it_courses_learner_state FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Public Certificates Table (Allows public verification by certificate ID)
CREATE TABLE IF NOT EXISTS public.it_courses_certificates (
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

ALTER TABLE public.it_courses_certificates ENABLE ROW LEVEL SECURITY;

-- Allow ANYONE (including anonymous visitors) to verify valid certificates
CREATE POLICY "Public read access for IT Courses certificates"
  ON public.it_courses_certificates FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to publish/record their earned certificates
CREATE POLICY "Authenticated users can record their own IT Courses certificates"
  ON public.it_courses_certificates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_it_courses_certificates_id ON public.it_courses_certificates(id);
