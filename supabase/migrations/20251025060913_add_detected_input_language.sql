/*
  # Add detected input language field

  1. Changes
    - Add `detected_input_language` column to `prompts` table
      - Stores the language detected from user's input text
      - Used to display accurate "Auto Match (Language)" in language selector
    
  2. Notes
    - This field is separate from `output_language` which is the final generated language
    - Allows the UI to show what language was detected from user input
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prompts' AND column_name = 'detected_input_language'
  ) THEN
    ALTER TABLE prompts ADD COLUMN detected_input_language text;
  END IF;
END $$;