import { createClient } from '@supabase/supabase-js';
import { getBaseUrl } from './domainRedirect';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type IntentData = {
  theme?: string;
  subject?: string;
  scene?: string;
  tone?: string;
  lighting?: string;
  timeOfDay?: string;
  emotion?: string;
};

export type StyleData = {
  director?: string;
  cameraMovement?: string[];
  shotType?: string[];
  lighting?: string[];
  colorPalette?: string[];
  mood?: string[];
  technicalSpecs?: {
    fps?: string;
    aspect?: string;
    lens?: string;
  };
};

export type Prompt = {
  id: string;
  user_id?: string;
  session_id?: string;
  user_input: string;
  generated_prompt: string;
  intent_data: IntentData;
  style_data: StyleData;
  quality_score: number;
  mode: 'quick' | 'director';
  detected_input_language?: string;
  output_language?: string;
  created_at: string;
  updated_at: string;
};

export type PromptVersion = {
  id: string;
  prompt_id: string;
  version_number: number;
  generated_prompt: string;
  improvement_note: string;
  quality_score: number;
  created_at: string;
};

export type StyleLibrary = {
  id: string;
  director_name: string;
  style_tags: string[];
  visual_characteristics: {
    camera?: string[];
    lighting?: string[];
    color?: string[];
    mood?: string[];
  };
  example_prompts: string[];
  created_at: string;
};
