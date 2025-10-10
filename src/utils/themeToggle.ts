// Lightweight theme manager with View Transitions API integration
// Exposes: initTheme(), getTheme(), toggleThemeWithTransition()

export type ThemeMode = 'light' | 'dark';

const THEME_KEY = 'theme-preference';

const prefersDark = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

export const getTheme = (): ThemeMode => {
  const saved = (localStorage.getItem(THEME_KEY) || '').toLowerCase();
  if (saved === 'light' || saved === 'dark') return saved;
  return prefersDark() ? 'dark' : 'light';
};

export const applyTheme = (mode: ThemeMode) => {
  const root = document.documentElement;
  root.classList.toggle('dark', mode === 'dark');
  root.setAttribute('data-theme', mode);
  // Expose to CSS (scrollbars, forms)
  document.documentElement.style.colorScheme = mode;
  // Persist
  localStorage.setItem(THEME_KEY, mode);
  // Notify listeners (React provider, etc.)
  window.dispatchEvent(new CustomEvent('theme-change', { detail: { mode } }));
};

export const switchTheme = () => {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
};

type DocumentWithViewTransition = Document & {
  startViewTransition?: (cb: () => void) => void;
};

export const toggleThemeWithTransition = () => {
  // Two-line recipe from the plugin docs
  const doc = document as DocumentWithViewTransition;
  if (!doc.startViewTransition) {
    switchTheme();
    return;
  }
  doc.startViewTransition(() => switchTheme());
};

export const initTheme = () => {
  // Apply immediately on load to avoid FOUC
  applyTheme(getTheme());
  // Keep in sync with system preference if user hasn't explicitly chosen
  try {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const saved = localStorage.getItem(THEME_KEY);
      if (!saved) applyTheme(prefersDark() ? 'dark' : 'light');
    };
    media.addEventListener?.('change', onChange);
  } catch {
    // no-op: older browsers may not support addEventListener on matchMedia
  }
};
