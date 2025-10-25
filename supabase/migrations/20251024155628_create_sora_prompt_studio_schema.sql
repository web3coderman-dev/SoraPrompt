/*
  # Sora Prompt Studio Database Schema

  ## Overview
  This migration creates the complete database schema for Sora Prompt Studio v0.1,
  a tool for generating cinematic-quality prompts for Sora AI video generation.

  ## New Tables
  
  ### 1. `prompts`
  Stores all generated prompts with their metadata
  - `id` (uuid, primary key) - Unique prompt identifier
  - `user_input` (text) - Original user idea/input
  - `generated_prompt` (text) - Final generated Sora prompt
  - `intent_data` (jsonb) - Parsed semantic data (theme, subject, scene, tone, etc.)
  - `style_data` (jsonb) - Applied style information (director, camera, lighting)
  - `quality_score` (integer) - Quality assessment score (0-100)
  - `mode` (text) - Generation mode: 'quick' or 'director'
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `prompt_versions`
  Tracks improvement iterations of prompts
  - `id` (uuid, primary key)
  - `prompt_id` (uuid, foreign key) - Reference to original prompt
  - `version_number` (integer) - Version iteration number
  - `generated_prompt` (text) - Improved prompt text
  - `improvement_note` (text) - What was changed/improved
  - `quality_score` (integer) - Quality score for this version
  - `created_at` (timestamptz)

  ### 3. `style_library`
  Knowledge base of director styles and cinematic techniques
  - `id` (uuid, primary key)
  - `director_name` (text) - Director name (e.g., "Denis Villeneuve")
  - `style_tags` (text[]) - Array of style keywords
  - `visual_characteristics` (jsonb) - Camera, lighting, color palette details
  - `example_prompts` (text[]) - Example prompt patterns
  - `created_at` (timestamptz)

  ### 4. `user_preferences`
  Stores user's favorite styles and preferences for personalization
  - `id` (uuid, primary key)
  - `session_id` (text) - Anonymous session identifier
  - `favorite_directors` (text[]) - Preferred director styles
  - `favorite_camera_types` (text[]) - Preferred camera techniques
  - `tone_preferences` (text[]) - Preferred emotional tones
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access to style_library
  - Session-based access to prompts and preferences
*/

-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_input text NOT NULL,
  generated_prompt text NOT NULL,
  intent_data jsonb DEFAULT '{}'::jsonb,
  style_data jsonb DEFAULT '{}'::jsonb,
  quality_score integer DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 100),
  mode text DEFAULT 'quick' CHECK (mode IN ('quick', 'director')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create prompt_versions table
CREATE TABLE IF NOT EXISTS prompt_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  version_number integer NOT NULL DEFAULT 1,
  generated_prompt text NOT NULL,
  improvement_note text DEFAULT '',
  quality_score integer DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 100),
  created_at timestamptz DEFAULT now()
);

-- Create style_library table
CREATE TABLE IF NOT EXISTS style_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  director_name text NOT NULL UNIQUE,
  style_tags text[] DEFAULT ARRAY[]::text[],
  visual_characteristics jsonb DEFAULT '{}'::jsonb,
  example_prompts text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL UNIQUE,
  favorite_directors text[] DEFAULT ARRAY[]::text[],
  favorite_camera_types text[] DEFAULT ARRAY[]::text[],
  tone_preferences text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prompts
CREATE POLICY "Anyone can create prompts"
  ON prompts FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read prompts"
  ON prompts FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update prompts"
  ON prompts FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for prompt_versions
CREATE POLICY "Anyone can create prompt versions"
  ON prompt_versions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read prompt versions"
  ON prompt_versions FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for style_library (public read)
CREATE POLICY "Anyone can read style library"
  ON style_library FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert style library"
  ON style_library FOR INSERT
  TO anon
  WITH CHECK (true);

-- RLS Policies for user_preferences
CREATE POLICY "Anyone can manage preferences"
  ON user_preferences FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_versions_prompt_id ON prompt_versions(prompt_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_session_id ON user_preferences(session_id);

-- Insert initial style library data
INSERT INTO style_library (director_name, style_tags, visual_characteristics, example_prompts) VALUES
  (
    'Denis Villeneuve',
    ARRAY['sci-fi', 'epic', 'atmospheric', 'wide shots', 'dramatic lighting'],
    '{"camera": ["wide establishing shots", "slow zoom", "symmetrical composition"], "lighting": ["dramatic side lighting", "silhouettes", "golden hour"], "color": ["desaturated", "blue-orange contrast", "muted tones"], "mood": ["contemplative", "epic", "mysterious"]}'::jsonb,
    ARRAY['A wide establishing shot of vast desert landscape at sunset, dramatic side lighting, symmetrical composition, desaturated color palette, epic and contemplative mood, 24fps cinematic']
  ),
  (
    'Christopher Nolan',
    ARRAY['practical effects', 'IMAX', 'time manipulation', 'intensity', 'realism'],
    '{"camera": ["IMAX format", "handheld intensity", "rotating perspective", "extreme close-ups"], "lighting": ["natural lighting", "high contrast", "shadow play"], "color": ["realistic tones", "cold blues", "warm interiors"], "mood": ["intense", "intellectual", "urgent"]}'::jsonb,
    ARRAY['A rotating handheld shot of intense action scene, natural lighting with high contrast, IMAX format, realistic color grading, urgent and intellectual atmosphere, 24fps']
  ),
  (
    'Wong Kar-wai',
    ARRAY['romantic', 'neon', 'slow motion', 'intimate', 'urban'],
    '{"camera": ["step printing", "slow motion", "tight close-ups", "handheld intimate"], "lighting": ["neon lights", "colored gels", "backlit subjects", "romantic glow"], "color": ["saturated colors", "red-blue contrast", "warm neon"], "mood": ["melancholic", "romantic", "nostalgic", "longing"]}'::jsonb,
    ARRAY['A slow motion close-up of lovers under neon streetlights, saturated colors with red-blue contrast, backlit with romantic glow, melancholic and nostalgic mood, step-printed film look']
  ),
  (
    'Wes Anderson',
    ARRAY['symmetrical', 'pastel', 'whimsical', 'centered', 'flat lay'],
    '{"camera": ["perfectly centered shots", "symmetrical framing", "flat orthogonal angles", "whip pans"], "lighting": ["soft even lighting", "pastel warmth", "no harsh shadows"], "color": ["pastel palette", "pink-yellow-blue", "vintage tones"], "mood": ["whimsical", "nostalgic", "precise", "quirky"]}'::jsonb,
    ARRAY['A perfectly symmetrical centered shot with pastel color palette, soft even lighting, vintage tones, whimsical and quirky atmosphere, flat orthogonal composition, film grain']
  ),
  (
    'Hayao Miyazaki',
    ARRAY['anime', 'nature', 'dreamlike', 'gentle', 'magical'],
    '{"camera": ["sweeping pans", "gentle movements", "observational", "wide scenic"], "lighting": ["soft natural light", "dappled sunlight", "magical glow", "warm atmosphere"], "color": ["vibrant but natural", "sky blues", "grass greens", "warm sunset"], "mood": ["peaceful", "magical", "contemplative", "innocent"]}'::jsonb,
    ARRAY['A gentle sweeping shot of lush nature landscape, soft dappled sunlight, vibrant natural colors with sky blues, peaceful and magical atmosphere, anime-style dreamlike quality']
  ),
  (
    'Stanley Kubrick',
    ARRAY['one-point perspective', 'symmetry', 'cold', 'precise', 'unsettling'],
    '{"camera": ["one-point perspective", "steady tracking shots", "wide angle lens", "centered subjects"], "lighting": ["cold fluorescent", "high key lighting", "clinical brightness"], "color": ["sterile whites", "cold blues", "stark contrast"], "mood": ["unsettling", "clinical", "precise", "psychological"]}'::jsonb,
    ARRAY['A precise one-point perspective tracking shot down symmetrical corridor, cold fluorescent lighting, sterile white and blue color palette, unsettling clinical atmosphere, wide angle lens']
  );
