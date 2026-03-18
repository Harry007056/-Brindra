import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();
const DEFAULT_ACCENT_COLOR = '#5E81AC';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const resolveSystemTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const normalizeHex = (value) => {
  const hex = String(value || '').trim();
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex.toUpperCase();
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`.toUpperCase();
  }
  return DEFAULT_ACCENT_COLOR;
};

const hexToRgb = (value) => {
  const hex = normalizeHex(value).slice(1);
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
};

const mixColor = (baseHex, targetHex, amount) => {
  const base = hexToRgb(baseHex);
  const target = hexToRgb(targetHex);
  const mix = Math.min(1, Math.max(0, amount));
  const channel = (key) => Math.round(base[key] + (target[key] - base[key]) * mix);
  const next = [channel('r'), channel('g'), channel('b')]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');
  return `#${next}`.toUpperCase();
};

const applyAccentColor = (color) => {
  if (typeof document === 'undefined') return;

  const primary = normalizeHex(color);
  const soft = mixColor(primary, '#FFFFFF', 0.28);
  const deep = mixColor(primary, '#0F1724', 0.22);
  const deeper = mixColor(primary, '#0F1724', 0.38);
  const { r, g, b } = hexToRgb(primary);
  const softRgb = hexToRgb(soft);

  document.documentElement.style.setProperty('--accent-primary', primary);
  document.documentElement.style.setProperty('--accent-primary-rgb', `${r} ${g} ${b}`);
  document.documentElement.style.setProperty('--accent-soft', soft);
  document.documentElement.style.setProperty('--accent-soft-rgb', `${softRgb.r} ${softRgb.g} ${softRgb.b}`);
  document.documentElement.style.setProperty('--accent-deep', deep);
  document.documentElement.style.setProperty('--accent-deeper', deeper);
};

export const ThemeProvider = ({ children }) => {
  const [themePreference, setThemePreference] = useState('dark');
  const [effectiveTheme, setEffectiveTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT_COLOR);

  // Load from localStorage on mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('themePreference') || 'dark';
    const savedAccent = localStorage.getItem('accentColor') || DEFAULT_ACCENT_COLOR;
    setThemePreference(savedPreference);
    setAccentColor(normalizeHex(savedAccent));
  }, []);

  // Compute effective theme and update html data-theme
  useEffect(() => {
    const theme = themePreference === 'system' ? resolveSystemTheme() : themePreference;
    setEffectiveTheme(theme);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [themePreference]);

  useEffect(() => {
    applyAccentColor(accentColor);
  }, [accentColor]);

  // Listen to system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (themePreference === 'system') {
        const newTheme = resolveSystemTheme();
        setEffectiveTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themePreference]);

  // Persist preference to localStorage
  const setTheme = (newPreference) => {
    setThemePreference(newPreference);
    localStorage.setItem('themePreference', newPreference);
  };

  const value = {
    themePreference,
    effectiveTheme,
    theme: effectiveTheme, // For Settings display/props
    setTheme,
    accentColor,
    setAccentColor: (color) => {
      const nextColor = normalizeHex(color);
      setAccentColor(nextColor);
      localStorage.setItem('accentColor', nextColor);
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
