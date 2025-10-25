/*
  # Add Language Support to Prompts

  1. Changes
    - Add `output_language` column to `prompts` table to store the user's selected output language
    - Add `output_language` column to `prompt_versions` table for version-specific language tracking
    - Add `default_language` column to `user_preferences` table to store user's default language preference
  
  2. Notes
    - Language codes follow ISO 639-1 standard (2-letter codes: zh, en, ja, ko, es, fr, de, ru, pt, it, ar, hi, tr, nl, pl, sv, vi, th, id, etc.)
    - System can detect and support ANY language automatically via AI
    - Default language is 'en' for existing and new records
    - No validation constraint on language codes - AI dynamically supports all languages
*/

-- Add output_language to prompts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prompts' AND column_name = 'output_language'
  ) THEN
    ALTER TABLE prompts ADD COLUMN output_language text DEFAULT 'en';
  END IF;
END $$;

-- Add output_language to prompt_versions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prompt_versions' AND column_name = 'output_language'
  ) THEN
    ALTER TABLE prompt_versions ADD COLUMN output_language text DEFAULT 'en';
  END IF;
END $$;

-- Add default_language to user_preferences table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'default_language'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN default_language text DEFAULT 'auto';
  END IF;
END $$;
