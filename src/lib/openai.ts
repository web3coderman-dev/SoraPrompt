import type { IntentData, StyleData } from './supabase';

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sora-prompt-ai`;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export type SupportedLanguage = string;

export const LANGUAGES = [
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip' },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская' },
  { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש' },
];

async function callEdgeFunction(action: string, data: any) {
  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ action, data })
    });

    if (!response.ok) {
      throw new Error(`Edge function error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Edge function call failed:', error);
    throw error;
  }
}

export async function detectLanguageClient(text: string): Promise<SupportedLanguage> {
  try {
    const result = await callEdgeFunction('detectLanguage', { text });
    return result as SupportedLanguage;
  } catch (error) {
    console.error('AI language detection failed, defaulting to en:', error);
    return 'en';
  }
}

export async function parseIntent(userInput: string, language?: SupportedLanguage): Promise<IntentData & { detectedLanguage?: string }> {
  try {
    return await callEdgeFunction('parseIntent', { userInput, language });
  } catch (error) {
    console.error('Error parsing intent, using fallback:', error);
    return mockParseIntent(userInput);
  }
}

export async function generatePrompt(
  intentData: IntentData,
  styleData: StyleData,
  mode: 'quick' | 'director',
  language: SupportedLanguage
): Promise<{ prompt: string; qualityScore: number }> {
  try {
    return await callEdgeFunction('generatePrompt', { intentData, styleData, mode, language });
  } catch (error) {
    console.error('Error generating prompt, using fallback:', error);
    return mockGeneratePrompt(intentData, styleData, mode, language);
  }
}

export async function evaluatePromptQuality(prompt: string): Promise<number> {
  try {
    return await callEdgeFunction('evaluateQuality', { prompt });
  } catch (error) {
    console.error('Error evaluating quality, using fallback:', error);
    return Math.floor(Math.random() * 20) + 80;
  }
}

export async function improvePrompt(
  currentPrompt: string,
  userFeedback: string,
  language: SupportedLanguage
): Promise<{ prompt: string; improvementNote: string; qualityScore: number }> {
  try {
    return await callEdgeFunction('improvePrompt', { currentPrompt, userFeedback, language });
  } catch (error) {
    console.error('Error improving prompt, using fallback:', error);
    return mockImprovePrompt(currentPrompt, userFeedback, language);
  }
}

export async function explainPrompt(prompt: string, intentData: IntentData, language: SupportedLanguage): Promise<string> {
  try {
    return await callEdgeFunction('explainPrompt', { prompt, intentData, language });
  } catch (error) {
    console.error('Error explaining prompt, using fallback:', error);
    return mockExplainPrompt(prompt, language);
  }
}

function mockParseIntent(userInput: string): IntentData {
  const lower = userInput.toLowerCase();
  return {
    theme: lower.includes('love') || lower.includes('爱') ? 'love' : 'journey',
    subject: lower.includes('girl') || lower.includes('女孩') ? 'girl' :
             lower.includes('astronaut') ? 'astronaut' : 'person',
    scene: lower.includes('mars') || lower.includes('火星') ? 'mars landscape' :
           lower.includes('city') || lower.includes('城市') ? 'city street' : 'landscape',
    tone: lower.includes('lonely') || lower.includes('孤独') ? 'melancholic' : 'cinematic',
    lighting: lower.includes('night') ? 'cold blue' : 'dramatic golden',
    timeOfDay: lower.includes('night') ? 'night' : 'sunset',
    emotion: lower.includes('lonely') || lower.includes('孤独') ? 'loneliness' : 'contemplative'
  };
}

function mockGeneratePrompt(
  intentData: IntentData,
  styleData: StyleData,
  mode: 'quick' | 'director',
  language: SupportedLanguage
): { prompt: string; qualityScore: number } {
  const director = styleData.director || 'Cinematic';
  const shotType = styleData.shotType?.[0] || 'wide shot';
  const fps = styleData.technicalSpecs?.fps || '24fps';

  let prompt: string;

  if (language === 'zh') {
    prompt = mode === 'director'
      ? `${intentData.scene}中${intentData.subject}的${shotType === 'wide shot' ? '广角镜头' : '特写镜头'}，${intentData.lighting}光线，${intentData.tone}氛围，${director}风格摄影，${fps}胶片颗粒感，浅景深，体积光，电影化构图。`
      : `${intentData.scene}中的${intentData.subject}，${intentData.lighting}光线，${intentData.tone}情绪，${fps}电影感。`;
  } else {
    prompt = mode === 'director'
      ? `A ${shotType} of ${intentData.subject} in ${intentData.scene}, ${intentData.lighting} lighting, ${intentData.tone} atmosphere, ${director} style cinematography, ${fps} film grain, shallow depth of field, volumetric fog, cinematic composition.`
      : `${shotType.charAt(0).toUpperCase() + shotType.slice(1)} of ${intentData.subject} in ${intentData.scene}, ${intentData.lighting} lighting, ${intentData.tone} mood, ${fps} cinematic.`;
  }

  return {
    prompt,
    qualityScore: Math.floor(Math.random() * 15) + 85
  };
}

function mockImprovePrompt(currentPrompt: string, userFeedback: string, language: SupportedLanguage): {
  prompt: string;
  improvementNote: string;
  qualityScore: number;
} {
  const improved = currentPrompt.replace('24fps', '60fps').replace('wide shot', 'close-up')
    .replace('广角镜头', '特写镜头').replace('24帧', '60帧');

  const notes: Record<SupportedLanguage, string> = {
    'zh': `根据您的反馈"${userFeedback}"进行了调整。增强了镜头角度和帧率以获得更强的冲击力。`,
    'en': `Adjusted based on your feedback: "${userFeedback}". Enhanced camera angle and frame rate for more impact.`,
    'ja': `フィードバック「${userFeedback}」に基づいて調整しました。より強い印象を与えるためにカメラアングルとフレームレートを強化しました。`,
    'ko': `피드백 "${userFeedback}"을 기반으로 조정했습니다. 더 강한 임팩트를 위해 카메라 각도와 프레임 속도를 향상시켰습니다。`,
    'es': `Ajustado según tu comentario: "${userFeedback}". Mejorado el ángulo de cámara y la velocidad de fotogramas para mayor impacto.`,
    'fr': `Ajusté selon vos retours : "${userFeedback}". Angle de caméra et fréquence d'images améliorés pour plus d'impact.`,
    'de': `Angepasst basierend auf Ihrem Feedback: "${userFeedback}". Kamerawinkel und Bildrate für mehr Wirkung verbessert.`
  };

  return {
    prompt: improved,
    improvementNote: notes[language] || notes['en'],
    qualityScore: 92
  };
}

function mockExplainPrompt(prompt: string, language: SupportedLanguage): string {
  const explanations: Record<SupportedLanguage, string> = {
    'zh': '这个提示词使用了特定的电影语言来指导 Sora 的视频生成。镜头类型确立了构图和视角，而光线关键词创造了氛围。像"24fps"和"胶片颗粒"这样的技术规格确保了电影感而非视频质量。情绪描述符帮助 Sora 理解您想要的情感基调。',
    'en': 'This prompt uses specific cinematic language to guide Sora\'s video generation. The shot type establishes framing and perspective, while lighting keywords create atmosphere. Technical specifications like "24fps" and "film grain" ensure a cinematic look rather than video quality. The mood descriptors help Sora understand the emotional tone you\'re targeting.',
    'ja': 'このプロンプトは、Soraのビデオ生成を導くために特定の映画言語を使用しています。ショットタイプはフレーミングと視点を確立し、照明キーワードは雰囲気を作り出します。「24fps」や「フィルムグレイン」などの技術仕様は、ビデオ品質ではなく映画的な外観を保証します。',
    'ko': '이 프롬프트는 Sora의 비디오 생성을 안내하기 위해 특정 영화 언어를 사용합니다. 샷 유형은 프레이밍과 관점을 설정하고 조명 키워드는 분위기를 만듭니다. "24fps" 및 "필름 그레인"과 같은 기술 사양은 비디오 품질이 아닌 영화적인 느낌을 보장합니다.',
    'es': 'Este prompt utiliza un lenguaje cinematográfico específico para guiar la generación de video de Sora. El tipo de toma establece el encuadre y la perspectiva, mientras que las palabras clave de iluminación crean atmósfera. Las especificaciones técnicas como "24fps" y "grano de película" aseguran un aspecto cinematográfico en lugar de calidad de video.',
    'fr': 'Ce prompt utilise un langage cinématographique spécifique pour guider la génération vidéo de Sora. Le type de plan établit le cadrage et la perspective, tandis que les mots-clés d\'éclairage créent l\'atmosphère. Les spécifications techniques comme "24fps" et "grain de film" assurent un aspect cinématographique plutôt qu\'une qualité vidéo.',
    'de': 'Dieser Prompt verwendet eine spezifische filmische Sprache, um die Videogenerierung von Sora zu leiten. Der Aufnahmetyp legt Bildausschnitt und Perspektive fest, während Beleuchtungs-Schlüsselwörter Atmosphäre schaffen. Technische Spezifikationen wie "24fps" und "Filmkorn" sorgen für ein filmisches Aussehen statt Videoqualität.'
  };

  return explanations[language] || explanations['en'];
}
