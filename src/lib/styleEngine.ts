import { supabase } from './supabase';
import type { IntentData, StyleData, StyleLibrary } from './supabase';

export async function matchDirectorStyle(intentData: IntentData): Promise<StyleData> {
  const { data: styles } = await supabase
    .from('style_library')
    .select('*');

  if (!styles || styles.length === 0) {
    return getDefaultStyle();
  }

  const directorStyle = findBestMatchingDirector(intentData, styles);

  const characteristics = directorStyle.visual_characteristics;

  return {
    director: directorStyle.director_name,
    cameraMovement: characteristics.camera || [],
    shotType: extractShotTypes(characteristics.camera || []),
    lighting: characteristics.lighting || [],
    colorPalette: characteristics.color || [],
    mood: characteristics.mood || [],
    technicalSpecs: {
      fps: '24fps',
      aspect: '16:9',
      lens: inferLensType(directorStyle.director_name)
    }
  };
}

function findBestMatchingDirector(intentData: IntentData, styles: StyleLibrary[]): StyleLibrary {
  const tone = intentData.tone?.toLowerCase() || '';
  const theme = intentData.theme?.toLowerCase() || '';
  const scene = intentData.scene?.toLowerCase() || '';

  if (tone.includes('romantic') || tone.includes('melancholic') || tone.includes('nostalgic')) {
    return styles.find(s => s.director_name === 'Wong Kar-wai') || styles[0];
  }

  if (theme.includes('sci-fi') || scene.includes('mars') || scene.includes('space') || scene.includes('future')) {
    return styles.find(s => s.director_name === 'Denis Villeneuve') || styles[0];
  }

  if (tone.includes('whimsical') || tone.includes('quirky') || tone.includes('precise')) {
    return styles.find(s => s.director_name === 'Wes Anderson') || styles[0];
  }

  if (tone.includes('intense') || tone.includes('urgent') || theme.includes('action')) {
    return styles.find(s => s.director_name === 'Christopher Nolan') || styles[0];
  }

  if (tone.includes('peaceful') || tone.includes('magical') || theme.includes('nature') || theme.includes('anime')) {
    return styles.find(s => s.director_name === 'Hayao Miyazaki') || styles[0];
  }

  if (tone.includes('unsettling') || tone.includes('psychological') || tone.includes('clinical')) {
    return styles.find(s => s.director_name === 'Stanley Kubrick') || styles[0];
  }

  return styles[0];
}

function extractShotTypes(cameraDescriptions: string[]): string[] {
  const shotTypes: string[] = [];

  cameraDescriptions.forEach(desc => {
    const lower = desc.toLowerCase();
    if (lower.includes('wide') || lower.includes('establishing')) {
      shotTypes.push('wide shot');
    }
    if (lower.includes('close-up') || lower.includes('close up')) {
      shotTypes.push('close-up');
    }
    if (lower.includes('medium')) {
      shotTypes.push('medium shot');
    }
    if (lower.includes('drone') || lower.includes('aerial')) {
      shotTypes.push('drone shot');
    }
    if (lower.includes('tracking') || lower.includes('dolly')) {
      shotTypes.push('tracking shot');
    }
  });

  return shotTypes.length > 0 ? shotTypes : ['cinematic shot'];
}

function inferLensType(directorName: string): string {
  const lensMap: Record<string, string> = {
    'Denis Villeneuve': 'wide angle',
    'Christopher Nolan': 'IMAX',
    'Wong Kar-wai': '50mm prime',
    'Wes Anderson': '40mm anamorphic',
    'Hayao Miyazaki': 'standard lens',
    'Stanley Kubrick': 'wide angle'
  };

  return lensMap[directorName] || 'cinematic lens';
}

function getDefaultStyle(): StyleData {
  return {
    director: 'Cinematic',
    cameraMovement: ['smooth tracking', 'steady'],
    shotType: ['medium shot'],
    lighting: ['natural lighting', 'soft shadows'],
    colorPalette: ['balanced colors', 'natural tones'],
    mood: ['cinematic', 'professional'],
    technicalSpecs: {
      fps: '24fps',
      aspect: '16:9',
      lens: 'cinematic lens'
    }
  };
}

export async function getAllDirectors(): Promise<string[]> {
  const { data: styles } = await supabase
    .from('style_library')
    .select('director_name');

  return styles?.map(s => s.director_name) || [];
}

export async function getDirectorDetails(directorName: string): Promise<StyleLibrary | null> {
  const { data } = await supabase
    .from('style_library')
    .select('*')
    .eq('director_name', directorName)
    .maybeSingle();

  return data;
}
