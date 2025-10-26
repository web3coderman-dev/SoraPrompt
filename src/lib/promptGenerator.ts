import { parseIntent, generatePrompt, type SupportedLanguage } from './openai';
import { matchDirectorStyle } from './styleEngine';
import type { Prompt } from './supabase';
import { PromptStorage } from './promptStorage';

export async function generateSoraPrompt(
  userInput: string,
  mode: 'quick' | 'director',
  outputLanguage: SupportedLanguage,
  detectedInputLanguage: SupportedLanguage,
  userId?: string
): Promise<Prompt> {
  const intentData = await parseIntent(userInput, detectedInputLanguage);

  let styleData = {};
  if (mode === 'director') {
    styleData = await matchDirectorStyle(intentData);
  }

  const { prompt, qualityScore } = await generatePrompt(
    intentData,
    styleData,
    mode,
    outputLanguage
  );

  const promptData: Omit<Prompt, 'id'> = {
    user_id: userId,
    user_input: userInput,
    generated_prompt: prompt,
    intent_data: intentData,
    style_data: styleData,
    quality_score: qualityScore,
    mode,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (!userId) {
    throw new Error('User must be signed in to generate prompts');
  }

  const saved = await PromptStorage.saveToCloud(promptData, userId);
  if (!saved) {
    throw new Error('Failed to save prompt to cloud');
  }

  return saved;
}
