import es from './es.json';
import en from './en.json';
import localAssets from './assets.json';

interface LanguageMap {
  [key: string]: any;
}

export const languages = {
  en: 'EN',
  es: 'ES',
};

const english = en as LanguageMap;
const spanish = es as LanguageMap;

export const defaultLang = 'en';

const ASSETS_BASE = 'https://raw.githubusercontent.com/yuli-ferna/portfolio-assets/refs/heads/main';

export function localLang() {
  return { en: english, es: spanish };
}

// ── Translations ──────────────────────────────────────────────────────────────

export async function fetchTranslations(): Promise<{
  en: LanguageMap;
  es: LanguageMap;
}> {
  if (process.env.NODE_ENV === 'development') {
    return { en: english, es: spanish };
  }

  try {
    const results = await Promise.all(
      Object.keys(languages).map((lang) =>
        fetch(`${ASSETS_BASE}/locale/${lang}.json`)
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .catch(() => (lang === 'en' ? english : spanish)) // fallback per-lang
      )
    );
    const [en, es] = results;
    return { en, es };
  } catch {
    // Full fallback to local copies
    return { en: english, es: spanish };
  }
}

// ── Assets ────────────────────────────────────────────────────────────────────

export async function fetchAssets(): Promise<LanguageMap> {
  if (process.env.NODE_ENV === 'development') {
    return localAssets as LanguageMap;
  }

  try {
    const res = await fetch(`${ASSETS_BASE}/assets.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return localAssets as LanguageMap;
  }
}
