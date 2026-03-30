import { defaultLang, fetchTranslations, fetchAssets, localLang } from './ui';

// ── Bootstrap (runs once at build/SSR time) ───────────────────────────────────

export let ui: Record<string, Record<string, any>>;
export let assets: Record<string, any>;

ui = await fetchTranslations();
assets = await fetchAssets();

// ── Language helpers ──────────────────────────────────────────────────────────

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function replaceVariableField(
  translation: string,
  fieldsVar: string[],
  variable: Record<string, any>
) {
  for (const key of fieldsVar) {
    translation = translation.replaceAll(`{${key}}`, `${variable[key]}`);
  }
  return translation;
}

export function useTranslations(lang: string) {
  return function t(key: string, variable: Record<string, any> = {}) {
    const UI = ui ?? localLang();
    const source = UI[lang] ?? UI[defaultLang];
    const fieldsVar = Object.keys(variable);

    let translation = source?.[key] ?? UI[defaultLang]?.[key];
    if (typeof translation === 'string' && fieldsVar.length) {
      translation = replaceVariableField(translation, fieldsVar, variable);
    }
    return translation;
  };
}

export function getTranslatedPath(path: string, lang: string) {
  const clean = path.startsWith('/') ? path.slice(1) : path;
  if (!clean) return lang === defaultLang ? '/' : `/${lang}/`;
  return lang === defaultLang ? `/${clean}` : `/${lang}/${clean}`;
}

// ── Assets helper ─────────────────────────────────────────────────────────────

/**
 * useAssets() — resolves icon/image paths from assets.json.
 *
 * Usage:
 *   const a = useAssets();
 *   a.skill('typescript')       // → 'typescript.svg' (local) or CDN url
 *   a.image('portfolio', 'xlabs') // → 'portfolio/xlabs.webp'
 *   a.social('github')          // → 'github.svg'
 */
export function useAssets() {
  const a = assets ?? {};

  return {
    /** Resolve a skill icon path. Falls back to 'checkbox.svg'. */
    skill(name: string): string {
      const key = name.toLowerCase().replace(/\s+/g, '-');
      return a.skills?.[key] ?? a.skills?.[name] ?? 'checkbox.svg';
    },

    /** Resolve an image path by category and name.
     *  e.g. image('portfolio', 'xlabs') → 'portfolio/xlabs.webp'
     */
    image(category: string, name: string): string {
      return a.images?.[category]?.[name] ?? '';
    },

    /** Resolve a social icon path. */
    social(name: string): string {
      return a.social?.[name] ?? '';
    },

    /** Resolve a footer asset path. */
    footer(name: string): string {
      return a.footer?.[name] ?? '';
    },

    /** Raw access to the full assets object. */
    raw: a,
  };
}

export function getImage(image: string) {
	return String(image).startsWith("https") ? image : `/${image}`;
}
