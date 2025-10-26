import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, type Prompt, type IntentData, type StyleData } from '../lib/supabase';
import {
  parseIntent,
  generatePrompt,
  improvePrompt,
  explainPrompt,
  type SupportedLanguage
} from '../lib/openai';
import PromptInput from './PromptInput';
import PromptResult from './PromptResult';

type PromptResultType = Prompt & {
  output_language?: string;
};

type PromptContainerProps = {
  onResult: (result: PromptResultType) => void;
};

export default function PromptContainer({ onResult }: PromptContainerProps) {
  const { user, isGuest } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<PromptResultType | null>(null);
  const [isImproving, setIsImproving] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [explanation, setExplanation] = useState<string>();

  const handleGenerate = async (
    userInput: string,
    mode: 'quick' | 'director',
    language: SupportedLanguage,
    detectedInputLanguage: SupportedLanguage
  ) => {
    try {
      setIsLoading(true);
      setExplanation(undefined);

      const intentResult = await parseIntent(userInput, detectedInputLanguage);
      const intentData: IntentData = {
        theme: intentResult.theme,
        subject: intentResult.subject,
        scene: intentResult.scene,
        tone: intentResult.tone,
        lighting: intentResult.lighting,
        timeOfDay: intentResult.timeOfDay,
        emotion: intentResult.emotion
      };

      const styleData: StyleData = {
        director: 'Cinematic',
        shotType: ['wide shot'],
        technicalSpecs: { fps: '24fps' }
      };

      const result = await generatePrompt(intentData, styleData, mode, language);

      const promptData: PromptResultType = {
        id: crypto.randomUUID(),
        user_input: userInput,
        generated_prompt: result.prompt,
        intent_data: intentData,
        style_data: styleData,
        quality_score: result.qualityScore,
        mode,
        output_language: language,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (!isGuest && user) {
        const { data, error } = await supabase
          .from('prompts')
          .insert({
            user_id: user.id,
            user_input: userInput,
            generated_prompt: result.prompt,
            intent_data: intentData,
            style_data: styleData,
            quality_score: result.qualityScore,
            mode,
            output_language: language,
            detected_input_language: detectedInputLanguage
          })
          .select()
          .single();

        if (error) {
          console.error('Error saving prompt:', error);
        } else if (data) {
          promptData.id = data.id;
        }
      }

      setCurrentPrompt(promptData);
      onResult(promptData);
    } catch (error) {
      console.error('Error generating prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImprove = async (feedback: string) => {
    if (!currentPrompt) return;

    try {
      setIsImproving(true);
      const result = await improvePrompt(
        currentPrompt.generated_prompt,
        feedback,
        (currentPrompt.output_language as SupportedLanguage) || 'en'
      );

      const updatedPrompt: PromptResultType = {
        ...currentPrompt,
        generated_prompt: result.prompt,
        quality_score: result.qualityScore,
        updated_at: new Date().toISOString()
      };

      if (!isGuest && user) {
        await supabase
          .from('prompt_versions')
          .insert({
            prompt_id: currentPrompt.id,
            generated_prompt: result.prompt,
            improvement_note: result.improvementNote,
            quality_score: result.qualityScore
          });

        await supabase
          .from('prompts')
          .update({
            generated_prompt: result.prompt,
            quality_score: result.qualityScore,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentPrompt.id);
      }

      setCurrentPrompt(updatedPrompt);
      onResult(updatedPrompt);
    } catch (error) {
      console.error('Error improving prompt:', error);
    } finally {
      setIsImproving(false);
    }
  };

  const handleExplain = async () => {
    if (!currentPrompt) return;

    try {
      const result = await explainPrompt(
        currentPrompt.generated_prompt,
        currentPrompt.intent_data,
        (currentPrompt.output_language as SupportedLanguage) || 'en'
      );
      setExplanation(result);
    } catch (error) {
      console.error('Error explaining prompt:', error);
    }
  };

  const handleLanguageChange = async (language: SupportedLanguage) => {
    if (!currentPrompt) return;

    try {
      setIsChangingLanguage(true);
      const result = await generatePrompt(
        currentPrompt.intent_data,
        currentPrompt.style_data,
        currentPrompt.mode,
        language
      );

      const updatedPrompt: PromptResultType = {
        ...currentPrompt,
        generated_prompt: result.prompt,
        output_language: language,
        quality_score: result.qualityScore,
        updated_at: new Date().toISOString()
      };

      if (!isGuest && user) {
        await supabase
          .from('prompts')
          .update({
            generated_prompt: result.prompt,
            output_language: language,
            quality_score: result.qualityScore,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentPrompt.id);
      }

      setCurrentPrompt(updatedPrompt);
      onResult(updatedPrompt);
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsChangingLanguage(false);
    }
  };

  return (
    <div>
      <PromptInput
        onGenerate={handleGenerate}
        isLoading={isLoading}
      />
      {currentPrompt && (
        <div className="mt-8">
          <PromptResult
            prompt={currentPrompt}
            onImprove={handleImprove}
            onExplain={handleExplain}
            onLanguageChange={handleLanguageChange}
            isImproving={isImproving}
            isChangingLanguage={isChangingLanguage}
            explanation={explanation}
          />
        </div>
      )}
    </div>
  );
}
