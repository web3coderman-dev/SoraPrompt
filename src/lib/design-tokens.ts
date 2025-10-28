export const colors = {
  dark: {
    scene: {
      background: '#0B0D12',
      fill: '#141821',
      fillLight: '#1A1F2E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A0A8B8',
      tertiary: '#6B7280',
      disabled: '#4B5563',
    },
    border: {
      subtle: 'rgba(58, 108, 255, 0.1)',
      default: 'rgba(58, 108, 255, 0.2)',
      strong: 'rgba(58, 108, 255, 0.4)',
    },
    overlay: {
      light: 'rgba(0, 0, 0, 0.4)',
      medium: 'rgba(0, 0, 0, 0.6)',
      heavy: 'rgba(0, 0, 0, 0.8)',
    },
  },
  light: {
    scene: {
      background: '#FFFFFF',
      fill: '#F8F9FA',
      fillLight: '#F1F3F5',
    },
    text: {
      primary: '#1A1D23',
      secondary: '#4A5568',
      tertiary: '#718096',
      disabled: '#A0AEC0',
    },
    border: {
      subtle: 'rgba(0, 0, 0, 0.06)',
      default: 'rgba(0, 0, 0, 0.1)',
      strong: 'rgba(58, 108, 255, 0.3)',
    },
    overlay: {
      light: 'rgba(0, 0, 0, 0.3)',
      medium: 'rgba(0, 0, 0, 0.5)',
      heavy: 'rgba(0, 0, 0, 0.7)',
    },
  },
  shared: {
    light: {
      key: '#3A6CFF',
      rim: '#E4A24D',
      neon: '#8A60FF',
    },
    state: {
      ok: '#45E0A2',
      error: '#FF5E5E',
      warning: '#FFB74D',
      info: '#64B5F6',
    },
  },
};

export const fonts = {
  primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  script: '"EB Garamond", Georgia, serif',
  code: '"IBM Plex Mono", "Menlo", monospace',
  display: '"Space Grotesk", Inter, sans-serif',
};

export const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
};

export const fontWeights = {
  regular: 400,
  medium: 500,
  bold: 700,
};

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

export const spacing = {
  frame: {
    sm: '8px',
    md: '16px',
    lg: '32px',
    xl: '48px',
  },
  component: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
};

export const radius = {
  sm: '6px',
  md: '8px',
  card: '12px',
  lg: '16px',
  full: '9999px',
};

export const shadows = {
  dark: {
    light: '0 0 24px rgba(58, 108, 255, 0.2)',
    key: '0 8px 32px rgba(58, 108, 255, 0.3)',
    rim: '0 4px 16px rgba(228, 162, 77, 0.25)',
    neon: '0 0 20px rgba(138, 96, 255, 0.4)',
    depth: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      md: '0 4px 6px rgba(0, 0, 0, 0.16), 0 2px 4px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04)',
    },
  },
  light: {
    light: '0 0 24px rgba(58, 108, 255, 0.15)',
    key: '0 8px 32px rgba(58, 108, 255, 0.2)',
    rim: '0 4px 16px rgba(228, 162, 77, 0.2)',
    neon: '0 0 20px rgba(138, 96, 255, 0.3)',
    depth: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.12)',
      md: '0 4px 6px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.03)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.025)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.08), 0 10px 10px rgba(0, 0, 0, 0.02)',
    },
  },
};

export const motion = {
  camera: {
    pan: '300ms ease-in-out',
  },
  cut: {
    fade: '200ms ease-in',
  },
  light: {
    blink: '1000ms infinite alternate',
  },
  render: {
    pulse: '800ms ease-in-out infinite',
  },
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

export const zIndex = {
  base: 0,
  scene: 10,
  panel: 20,
  overlay: 30,
  hud: 40,
  modal: 50,
  toast: 60,
};

// Tooltip - High contrast tokens for readability
export const tooltip = {
  dark: {
    background: '#1F2937',
    text: '#F9FAFB',
    border: 'rgba(58, 108, 255, 0.3)',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(58, 108, 255, 0.2)',
  },
  light: {
    background: '#FFFFFF',
    text: '#111827',
    border: 'rgba(0, 0, 0, 0.15)',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1)',
  },
};

// Idea Card - Enhanced tokens for cinematic experience
export const ideaCard = {
  dark: {
    background: 'linear-gradient(135deg, #141821 0%, #1A1F2E 100%)',
    border: 'rgba(58, 108, 255, 0.25)',
    borderHover: 'rgba(58, 108, 255, 0.4)',
    shadow: '0 0 0 1px rgba(58, 108, 255, 0.08), 0 8px 24px rgba(0, 0, 0, 0.4), 0 16px 48px rgba(58, 108, 255, 0.12)',
    shadowHover: '0 0 0 1px rgba(58, 108, 255, 0.15), 0 12px 32px rgba(0, 0, 0, 0.5), 0 24px 64px rgba(58, 108, 255, 0.2)',
    input: {
      background: 'rgba(26, 31, 46, 0.6)',
      backgroundFocus: 'rgba(26, 31, 46, 0.8)',
      border: 'rgba(58, 108, 255, 0.15)',
      borderFocus: 'rgba(58, 108, 255, 0.3)',
      shadowFocus: '0 0 0 2px rgba(57, 97, 251, 0.2), 0 0 20px rgba(138, 96, 255, 0.15), inset 0 0 0 1px rgba(58, 108, 255, 0.3)',
      placeholder: 'rgba(255, 255, 255, 0.35)',
    },
    button: {
      primaryGradient: 'linear-gradient(135deg, #3961FB 0%, #5A7FFF 100%)',
      primaryGradientHover: 'linear-gradient(135deg, #4A72FF 0%, #6B8FFF 100%)',
      primaryShadow: '0 4px 12px rgba(57, 97, 251, 0.3), 0 0 20px rgba(57, 97, 251, 0.15)',
      primaryShadowHover: '0 6px 16px rgba(57, 97, 251, 0.4), 0 0 32px rgba(57, 97, 251, 0.25)',
      secondaryGradient: 'linear-gradient(135deg, #3961FB 0%, #8A60FF 50%, #A66BFF 100%)',
      secondaryShadow: '0 4px 12px rgba(138, 96, 255, 0.3), 0 0 20px rgba(138, 96, 255, 0.2)',
      secondaryShadowHover: '0 6px 16px rgba(138, 96, 255, 0.4), 0 0 32px rgba(138, 96, 255, 0.3)',
    },
    divider: 'linear-gradient(90deg, rgba(58, 108, 255, 0) 0%, rgba(58, 108, 255, 0.25) 50%, rgba(58, 108, 255, 0) 100%)',
  },
  light: {
    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
    border: 'rgba(58, 108, 255, 0.12)',
    borderHover: 'rgba(58, 108, 255, 0.2)',
    shadow: '0 0 0 1px rgba(58, 108, 255, 0.04), 0 4px 12px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(58, 108, 255, 0.06)',
    shadowHover: '0 0 0 1px rgba(58, 108, 255, 0.08), 0 6px 16px rgba(0, 0, 0, 0.06), 0 12px 32px rgba(58, 108, 255, 0.1)',
    input: {
      background: 'rgba(248, 248, 255, 0.8)',
      backgroundFocus: 'rgba(255, 255, 255, 0.95)',
      border: 'rgba(58, 108, 255, 0.12)',
      borderFocus: 'rgba(58, 108, 255, 0.3)',
      shadowFocus: '0 0 0 2px rgba(57, 97, 251, 0.15), 0 0 16px rgba(138, 96, 255, 0.1), inset 0 0 0 1px rgba(58, 108, 255, 0.2)',
      placeholder: 'rgba(0, 0, 0, 0.35)',
    },
    button: {
      primaryGradient: 'linear-gradient(135deg, #3961FB 0%, #5A7FFF 100%)',
      primaryGradientHover: 'linear-gradient(135deg, #4A72FF 0%, #6B8FFF 100%)',
      primaryShadow: '0 2px 8px rgba(57, 97, 251, 0.2), 0 0 16px rgba(57, 97, 251, 0.1)',
      primaryShadowHover: '0 4px 12px rgba(57, 97, 251, 0.25), 0 0 24px rgba(57, 97, 251, 0.15)',
      secondaryGradient: 'linear-gradient(135deg, #3961FB 0%, #8A60FF 50%, #A66BFF 100%)',
      secondaryShadow: '0 2px 8px rgba(138, 96, 255, 0.2), 0 0 16px rgba(138, 96, 255, 0.12)',
      secondaryShadowHover: '0 4px 12px rgba(138, 96, 255, 0.25), 0 0 24px rgba(138, 96, 255, 0.18)',
    },
    divider: 'linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.08) 50%, rgba(0, 0, 0, 0) 100%)',
  },
};
