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
    keyLight: '#3A6CFF',
    rimLight: '#E4A24D',
    neon: '#8A60FF',
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
