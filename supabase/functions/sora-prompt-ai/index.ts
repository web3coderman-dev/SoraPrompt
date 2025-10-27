import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';

const RATE_LIMIT_GUEST_PER_DAY = 5;
const RATE_LIMIT_ANON_PER_HOUR = 10;

interface RequestBody {
  action: 'parseIntent' | 'generatePrompt' | 'evaluateQuality' | 'improvePrompt' | 'explainPrompt' | 'detectLanguage';
  data: any;
  fingerprint?: string;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    windowStart: number;
  };
}

const rateLimitStore: RateLimitStore = {};

function checkRateLimit(identifier: string, isGuest: boolean): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const limit = isGuest ? RATE_LIMIT_GUEST_PER_DAY : RATE_LIMIT_ANON_PER_HOUR;
  const windowSize = isGuest ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000;

  if (!rateLimitStore[identifier]) {
    rateLimitStore[identifier] = {
      count: 0,
      windowStart: now,
    };
  }

  const record = rateLimitStore[identifier];
  const windowElapsed = now - record.windowStart;

  if (windowElapsed >= windowSize) {
    record.count = 0;
    record.windowStart = now;
  }

  const allowed = record.count < limit;
  const remaining = Math.max(0, limit - record.count);

  return { allowed, remaining };
}

function incrementRateLimit(identifier: string): void {
  if (rateLimitStore[identifier]) {
    rateLimitStore[identifier].count += 1;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const authHeader = req.headers.get('authorization');
    const isAuthenticated = authHeader && authHeader.includes('Bearer');

    const { action, data, fingerprint }: RequestBody = await req.json();

    if (!isAuthenticated) {
      const identifier = fingerprint || ipAddress;
      const rateCheck = checkRateLimit(identifier, !!fingerprint);

      if (!rateCheck.allowed) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please register for unlimited access or try again later.',
            remaining: 0,
            resetIn: fingerprint ? '24 hours' : '1 hour',
          }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      incrementRateLimit(identifier);
    }

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let result;

    switch (action) {
      case 'detectLanguage':
        result = await detectLanguage(data.text);
        break;
      case 'parseIntent':
        result = await parseIntent(data.userInput, data.language);
        break;
      case 'generatePrompt':
        result = await generatePrompt(data.intentData, data.styleData, data.mode, data.language);
        break;
      case 'evaluateQuality':
        result = await evaluateQuality(data.prompt);
        break;
      case 'improvePrompt':
        result = await improvePrompt(data.currentPrompt, data.userFeedback, data.language);
        break;
      case 'explainPrompt':
        result = await explainPrompt(data.prompt, data.intentData, data.language);
        break;
      default:
        throw new Error('Invalid action');
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function callOpenAI(messages: any[], responseFormat?: any) {
  const body: any = {
    model: 'gpt-4o',
    messages: messages
  };

  if (responseFormat) {
    body.response_format = responseFormat;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw error;
  }
}

async function detectLanguage(text: string): Promise<string> {
  const data = await callOpenAI([
    {
      role: 'system',
      content: `You are a language detection expert. Analyze the input text and detect its language.

Respond with ONLY the ISO 639-1 language code (2 letters).

Supported languages:
zh - Chinese (中文)
en - English
ja - Japanese (日本語)
ko - Korean (한국어)
es - Spanish (Español)
fr - French (Français)
de - German (Deutsch)
ru - Russian (Русский)
pt - Portuguese (Português)
it - Italian (Italiano)
ar - Arabic (العربية)
hi - Hindi (हिन्दी)
tr - Turkish (Türkçe)
nl - Dutch (Nederlands)
pl - Polish (Polski)
sv - Swedish (Svenska)
vi - Vietnamese (Tiếng Việt)
th - Thai (ไทย)
id - Indonesian (Bahasa Indonesia)
bn - Bengali (বাংলা)
he - Hebrew (עברית)
uk - Ukrainian (Українська)

CRITICAL: Output ONLY the 2-letter language code, nothing else. No explanation, no extra text.

Examples:
Input: "Hello world" → Output: en
Input: "สวัสดี" → Output: th
Input: "你好" → Output: zh
Input: "こんにちは" → Output: ja`
    },
    {
      role: 'user',
      content: text
    }
  ]);

  const detectedCode = data.choices[0].message.content.trim().toLowerCase();
  return detectedCode.match(/^[a-z]{2}$/) ? detectedCode : 'en';
}

function getLanguageGuidance(language: string): { instruction: string, example: string } {
  const guidance: Record<string, { instruction: string, example: string }> = {
    'zh': {
      instruction: '你必须用纯中文回答，不能使用任何英文单词（除了专业技术词汇如 24fps, 16:9 等）。所有描述性词语必须是中文。',
      example: '正确示例："广角镜头拍摄女孩在下雪的城市街道，戏剧性金色光线，电影感氛围，24fps胶片质感。"'
    },
    'en': {
      instruction: 'You must respond in pure English only. All descriptive words must be in English.',
      example: 'Correct: "Wide shot of girl walking in snowy city street, dramatic golden lighting, cinematic atmosphere, 24fps film grain."'
    },
    'ja': {
      instruction: '純粋な日本語で回答してください。技術用語（24fps, 16:9など）以外はすべて日本語で記述してください。',
      example: '正しい例："雪の降る街を歩く少女のワイドショット、ドラマチックな金色の照明、24fpsフィルムグレイン。"'
    },
    'ko': {
      instruction: '순수한 한국어로만 답해주세요. 기술 용어(24fps, 16:9 등)를 제외하고는 모두 한국어로 작성해주세요.',
      example: '올바른 예시: "눈 내리는 도시 거리를 걷는 소녀의 와이드 샷, 드라마틱한 황금빛 조명, 24fps 필름 그레인."'
    },
    'es': {
      instruction: 'Debe responder únicamente en español puro. Todas las palabras descriptivas deben estar en español.',
      example: 'Correcto: "Plano amplio de chica caminando en calle nevada de ciudad, iluminación dramática dorada, atmósfera cinematográfica, 24fps grano de película."'
    },
    'fr': {
      instruction: 'Vous devez répondre uniquement en français pur. Tous les mots descriptifs doivent être en français.',
      example: 'Correct: "Plan large d\'une fille marchant dans une rue enneigée de la ville, éclairage doré dramatique, atmosphère cinématographique, 24fps grain de film."'
    },
    'de': {
      instruction: 'Sie müssen ausschließlich auf reinem Deutsch antworten. Alle beschreibenden Wörter müssen auf Deutsch sein.',
      example: 'Richtig: "Weitwinkelaufnahme eines Mädchens, das durch eine verschneite Stadtstraße geht, dramatische goldene Beleuchtung, filmische Atmosphäre, 24fps Filmkorn."'
    },
    'ru': {
      instruction: 'Вы должны отвечать исключительно на чистом русском языке. Все описательные слова должны быть на русском.',
      example: 'Правильно: "Широкий план девушки, идущей по заснеженной городской улице, драматичное золотое освещение, кинематографическая атмосфера, 24fps зернистость плёнки."'
    },
    'pt': {
      instruction: 'Você deve responder apenas em português puro. Todas as palavras descritivas devem estar em português.',
      example: 'Correto: "Plano amplo de garota caminhando em rua nevada da cidade, iluminação dourada dramática, atmosfera cinematográfica, 24fps granulação de filme."'
    },
    'it': {
      instruction: 'Devi rispondere esclusivamente in italiano puro. Tutte le parole descrittive devono essere in italiano.',
      example: 'Corretto: "Inquadratura ampia di ragazza che cammina in strada cittadina innevata, illuminazione dorata drammatica, atmosfera cinematografica, 24fps grana della pellicola."'
    },
    'th': {
      instruction: 'คุณต้องตอบเป็นภาษาไทยล้วนๆ เท่านั้น คำอธิบายทั้งหมดต้องเป็นภาษาไทย ยกเว้นศัพท์เทคนิค เช่น 24fps, 16:9 เป็นต้น',
      example: 'ตัวอย่างที่ถูกต้อง: "ช็อตกว้างของเด็กสาวเดินอยู่บนถนนในเมืองที่หิมะตก แสงสีทองอันน่าทึ่ง บรรยากาศแบบภาพยนตร์ 24fps ความละเอียดแบบฟิล์ม"'
    },
    'ar': {
      instruction: 'يجب أن تجيب بالعربية الفصحى فقط. جميع الكلمات الوصفية يجب أن تكون بالعربية.',
      example: 'صحيح: "لقطة واسعة لفتاة تمشي في شارع مدينة مثلج، إضاءة ذهبية درامية، أجواء سينمائية، 24fps حبيبات الفيلم."'
    },
    'hi': {
      instruction: 'आपको केवल शुद्ध हिंदी में जवाब देना होगा। सभी वर्णनात्मक शब्द हिंदी में होने चाहिए।',
      example: 'सही उदाहरण: "बर्फीली शहर की सड़क पर चलती लड़की का वाइड शॉट, नाटकीय सुनहरी रोशनी, सिनेमाई माहौल, 24fps फिल्म ग्रेन।"'
    }
  };

  if (guidance[language]) {
    return guidance[language];
  }

  return {
    instruction: `You must respond in the target language (${language}). All descriptive words must be in that language, except for technical terms like 24fps, 16:9, etc.`,
    example: 'Use pure, natural language for all descriptions while keeping technical specifications in their standard form.'
  };
}

async function parseIntent(userInput: string, language?: string) {
  const detectedLanguage = language || await detectLanguage(userInput);
  const { instruction, example } = getLanguageGuidance(detectedLanguage);
  
  const data = await callOpenAI(
    [
      {
        role: 'system',
        content: `You are an expert film director and cinematographer. Extract semantic elements from user input to understand their vision.

${instruction}

Output JSON with these fields (field names in English, but values in the target language):
- theme: main theme/concept
- subject: main subject/character
- scene: location/setting
- tone: emotional tone
- lighting: suggested lighting
- timeOfDay: time setting
- emotion: core emotion
- detectedLanguage: the language code (${detectedLanguage})`
      },
      {
        role: 'user',
        content: userInput
      }
    ],
    { type: 'json_object' }
  );

  return JSON.parse(data.choices[0].message.content);
}

async function generatePrompt(intentData: any, styleData: any, mode: string, language: string) {
  const { instruction, example } = getLanguageGuidance(language);
  
  const systemPrompt = mode === 'director'
    ? `You are a master cinematographer and film director. Generate a highly detailed, cinematic prompt for Sora AI video generation.

⚠️ CRITICAL LANGUAGE REQUIREMENT:
${instruction}

${example}

Include:
- Shot type and camera movement
- Lighting and atmosphere details
- Color palette and visual mood
- Technical specifications (fps, lens, aspect ratio)
- Cinematic references

Format: One cohesive paragraph optimized for Sora.`
    : `You are a film director. Generate a concise, cinematic prompt for Sora AI.

⚠️ CRITICAL LANGUAGE REQUIREMENT:
${instruction}

${example}

Include key visual elements: shot type, lighting, mood, and basic technical specs.
Format: Clear, direct prompt optimized for Sora.`;

  const data = await callOpenAI([
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: `Intent: ${JSON.stringify(intentData)}
Style: ${JSON.stringify(styleData)}

Generate the Sora prompt. REMEMBER: ${instruction}`
    }
  ]);

  const prompt = data.choices[0].message.content;
  const qualityScore = await evaluateQuality(prompt);

  return { prompt, qualityScore };
}

async function evaluateQuality(prompt: string): Promise<number> {
  const data = await callOpenAI([
    {
      role: 'system',
      content: `Rate this Sora prompt on a scale of 0-100 based on:
- Cinematic language quality
- Visual clarity and specificity
- Technical detail appropriateness
- Sora AI compatibility
- No redundancy or confusion

Output only a number between 0-100.`
    },
    { role: 'user', content: prompt }
  ]);

  const score = parseInt(data.choices[0].message.content.trim());
  return isNaN(score) ? 85 : Math.min(100, Math.max(0, score));
}

async function improvePrompt(currentPrompt: string, userFeedback: string, language: string) {
  const { instruction, example } = getLanguageGuidance(language);
  
  const data = await callOpenAI(
    [
      {
        role: 'system',
        content: `You are a film director improving a Sora prompt based on feedback.

⚠️ CRITICAL LANGUAGE REQUIREMENT:
${instruction}

${example}

Output JSON with:
- prompt: the improved prompt
- improvementNote: brief explanation of what changed (1-2 sentences)`
      },
      {
        role: 'user',
        content: `Current prompt: ${currentPrompt}

User feedback: ${userFeedback}

Improve the prompt accordingly. REMEMBER: ${instruction}`
      }
    ],
    { type: 'json_object' }
  );

  const result = JSON.parse(data.choices[0].message.content);
  const qualityScore = await evaluateQuality(result.prompt);

  return {
    prompt: result.prompt,
    improvementNote: result.improvementNote,
    qualityScore
  };
}

async function explainPrompt(prompt: string, intentData: any, language: string): Promise<string> {
  const { instruction } = getLanguageGuidance(language);
  
  const data = await callOpenAI([
    {
      role: 'system',
      content: `Explain why this Sora prompt was written this way.

${instruction}

Focus on:
- Key cinematic choices
- Why specific keywords matter
- How it achieves the intended mood
- Technical decisions

Write 3-4 clear, educational sentences.`
    },
    {
      role: 'user',
      content: `Prompt: ${prompt}
Original intent: ${JSON.stringify(intentData)}

Explain this prompt. REMEMBER: ${instruction}`
    }
  ]);

  return data.choices[0].message.content;
}
