let fingerprintPromise: Promise<string> | null = null;

export async function generateFingerprint(): Promise<string> {
  if (fingerprintPromise) {
    return fingerprintPromise;
  }

  fingerprintPromise = (async () => {
    try {
      const components = await collectComponents();
      const fingerprint = await hashComponents(components);
      return fingerprint;
    } catch (error) {
      console.error('Fingerprint generation failed:', error);
      return generateFallbackFingerprint();
    }
  })();

  return fingerprintPromise;
}

async function collectComponents(): Promise<Record<string, any>> {
  const components: Record<string, any> = {};

  components.userAgent = navigator.userAgent;
  components.language = navigator.language;
  components.languages = navigator.languages;
  components.platform = navigator.platform;
  components.hardwareConcurrency = navigator.hardwareConcurrency;
  components.deviceMemory = (navigator as any).deviceMemory;
  components.maxTouchPoints = navigator.maxTouchPoints;

  components.screenResolution = `${screen.width}x${screen.height}`;
  components.screenColorDepth = screen.colorDepth;
  components.screenPixelDepth = screen.pixelDepth;
  components.availableScreenResolution = `${screen.availWidth}x${screen.availHeight}`;

  components.timezoneOffset = new Date().getTimezoneOffset();
  components.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  components.sessionStorage = !!window.sessionStorage;
  components.localStorage = !!window.localStorage;
  components.indexedDB = !!window.indexedDB;
  components.openDatabase = !!window.openDatabase;
  components.cpuClass = (navigator as any).cpuClass;
  components.doNotTrack = navigator.doNotTrack;

  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 200;
      canvas.height = 50;
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('SoraPrompt', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Fingerprint', 4, 17);
      components.canvas = canvas.toDataURL();
    }
  } catch (e) {
    components.canvas = 'unsupported';
  }

  try {
    const gl = document.createElement('canvas').getContext('webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      components.webglVendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown';
      components.webglRenderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
    }
  } catch (e) {
    components.webglVendor = 'unsupported';
    components.webglRenderer = 'unsupported';
  }

  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const analyser = audioContext.createAnalyser();
    const gainNode = audioContext.createGain();
    const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

    gainNode.gain.value = 0;
    oscillator.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(0);

    await new Promise((resolve) => {
      scriptProcessor.onaudioprocess = (event) => {
        const output = event.outputBuffer.getChannelData(0);
        components.audio = Array.from(output.slice(0, 30)).join(',');
        oscillator.stop();
        scriptProcessor.disconnect();
        analyser.disconnect();
        gainNode.disconnect();
        resolve(null);
      };
    });

    await audioContext.close();
  } catch (e) {
    components.audio = 'unsupported';
  }

  try {
    const fonts = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Impact'];
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const testString = 'mmmmmmmmmmlli';
    const testSize = '72px';
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const baseFontSizes: Record<string, { width: number; height: number }> = {};

      for (const baseFont of baseFonts) {
        ctx.font = `${testSize} ${baseFont}`;
        const metrics = ctx.measureText(testString);
        baseFontSizes[baseFont] = {
          width: metrics.width,
          height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
        };
      }

      const detectedFonts: string[] = [];
      for (const font of fonts) {
        for (const baseFont of baseFonts) {
          ctx.font = `${testSize} ${font}, ${baseFont}`;
          const metrics = ctx.measureText(testString);
          const size = {
            width: metrics.width,
            height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
          };

          if (size.width !== baseFontSizes[baseFont].width || size.height !== baseFontSizes[baseFont].height) {
            detectedFonts.push(font);
            break;
          }
        }
      }

      components.fonts = detectedFonts.join(',');
    }
  } catch (e) {
    components.fonts = 'unsupported';
  }

  return components;
}

async function hashComponents(components: Record<string, any>): Promise<string> {
  const componentString = JSON.stringify(components);
  const encoder = new TextEncoder();
  const data = encoder.encode(componentString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

function generateFallbackFingerprint(): string {
  const fallbackData = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
  ].join('|');

  let hash = 0;
  for (let i = 0; i < fallbackData.length; i++) {
    const char = fallbackData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return Math.abs(hash).toString(16);
}

export function getCachedFingerprint(): string | null {
  return sessionStorage.getItem('soraprompt_fingerprint');
}

export function cacheFingerprint(fingerprint: string): void {
  sessionStorage.setItem('soraprompt_fingerprint', fingerprint);
}

export async function getOrGenerateFingerprint(): Promise<string> {
  const cached = getCachedFingerprint();
  if (cached) {
    return cached;
  }

  const fingerprint = await generateFingerprint();
  cacheFingerprint(fingerprint);
  return fingerprint;
}
