import { describe, expect, it, vi } from 'vitest';
import en from './en.json';
import es from './es.json';
import localAssets from './assets.json';
import {
  assets,
  getImage,
  getLangFromUrl,
  getTranslatedPath,
  replaceVariableField,
  ui,
  useAssets,
  useTranslations,
} from './utils';

const url = (path: string) => new URL(path, 'https://yuli-ferna.vercel.app');

describe('bootstrap', () => {
  // setup.ts makes fetch reject, so the module falls back to the local bundles.
  it('loads the local translations when the remote fetch fails', () => {
    expect(ui).toEqual({ en, es });
  });

  it('loads the local assets when the remote fetch fails', () => {
    expect(assets).toBe(localAssets);
  });
});

describe('getLangFromUrl', () => {
  it.each([
    ['/', 'en'],
    ['/es', 'es'],
    ['/es/', 'es'],
    ['/es/some/page', 'es'],
    ['/en/', 'en'],
    ['/fr/', 'en'],
    ['/about', 'en'],
    ['/ES/', 'en'],
  ])('%s → %s', (path, expected) => {
    expect(getLangFromUrl(url(path))).toBe(expected);
  });

  it('does not treat Object.prototype members as languages', () => {
    expect(getLangFromUrl(url('/constructor'))).toBe('en');
    expect(getLangFromUrl(url('/toString/'))).toBe('en');
    expect(getLangFromUrl(url('/__proto__'))).toBe('en');
  });
});

describe('replaceVariableField', () => {
  it('replaces a single placeholder', () => {
    expect(replaceVariableField('I have {years} years', ['years'], { years: 7 })).toBe('I have 7 years');
  });

  it('replaces every occurrence and multiple placeholders', () => {
    expect(
      replaceVariableField('{a}-{b}-{a}', ['a', 'b'], { a: 'x', b: 'y' }),
    ).toBe('x-y-x');
  });

  it('leaves unknown placeholders untouched', () => {
    expect(replaceVariableField('{a} {other}', ['a'], { a: 1 })).toBe('1 {other}');
  });

  it('returns the original string when there are no fields', () => {
    expect(replaceVariableField('plain', [], {})).toBe('plain');
  });
});

describe('useTranslations', () => {
  it('returns English strings', () => {
    const t = useTranslations('en');
    expect(t('seeHere')).toBe(en.seeHere);
    expect(t('contact').title).toBe(en.contact.title);
  });

  it('returns Spanish strings', () => {
    const t = useTranslations('es');
    expect(t('seeHere')).toBe(es.seeHere);
    expect(t('contact').title).toBe(es.contact.title);
    expect(t('contact').title).not.toBe(en.contact.title);
  });

  it('falls back to the default language for an unknown locale', () => {
    expect(useTranslations('fr')('contact')).toEqual(en.contact);
  });

  it('returns undefined for a key missing in every locale', () => {
    expect(useTranslations('es')('does.not.exist')).toBeUndefined();
  });

  it('interpolates variables', () => {
    const t = useTranslations('en');
    const result = t('home.description', { years: 8 });
    expect(result).toContain('8 years');
    expect(result).not.toContain('{years}');
  });

  it('interpolates variables in Spanish', () => {
    expect(useTranslations('es')('home.description', { years: 8 })).toContain('8 años');
  });

  it('does not try to interpolate into non-string values', () => {
    const t = useTranslations('en');
    expect(t('navbar', { years: 1 })).toEqual(en.navbar);
  });
});

describe('getTranslatedPath', () => {
  it.each([
    ['', 'en', '/'],
    ['/', 'en', '/'],
    ['', 'es', '/es/'],
    ['/', 'es', '/es/'],
    ['about', 'en', '/about'],
    ['/about', 'en', '/about'],
    ['about', 'es', '/es/about'],
    ['/blog/post', 'es', '/es/blog/post'],
  ])('(%j, %s) → %s', (path, lang, expected) => {
    expect(getTranslatedPath(path, lang)).toBe(expected);
  });
});

describe('useAssets', () => {
  const a = useAssets();

  it('resolves skills case-insensitively and with spaces as dashes', () => {
    expect(a.skill('React')).toBe('react.svg');
    expect(a.skill('Material UI')).toBe('material-ui.svg');
    expect(a.skill('c++')).toBe('c++.svg');
  });

  it('falls back to checkbox.svg for unknown skills', () => {
    expect(a.skill('Not A Skill')).toBe('checkbox.svg');
  });

  it('resolves images by category and name', () => {
    expect(a.image('portfolio', 'xlabs')).toBe('portfolio/xlabs.webp');
    expect(a.image('portfolio', 'missing')).toBe('');
    expect(a.image('missing', 'xlabs')).toBe('');
  });

  it('resolves social and footer icons', () => {
    expect(a.social('github')).toBe('github.svg');
    expect(a.social('myspace')).toBe('');
    expect(a.footer('astro')).toBe('astro.svg');
    expect(a.footer('missing')).toBe('');
  });

  it('exposes the raw manifest', () => {
    expect(a.raw).toBe(localAssets);
  });
});

describe('getImage', () => {
  it('keeps absolute https URLs', () => {
    expect(getImage('https://cdn.example.com/a.webp')).toBe('https://cdn.example.com/a.webp');
  });

  it('prefixes relative paths with a slash', () => {
    expect(getImage('portfolio/xlabs.webp')).toBe('/portfolio/xlabs.webp');
  });

  it('stringifies non-string input', () => {
    expect(getImage(undefined as unknown as string)).toBe('/undefined');
  });
});

describe('when the bootstrap yields nothing', () => {
  it('useTranslations falls back to the bundled locales and useAssets to empty values', async () => {
    vi.resetModules();
    vi.doMock('./ui', async (importOriginal) => {
      const original = await importOriginal<typeof import('./ui')>();
      return {
        ...original,
        fetchTranslations: vi.fn(async () => undefined),
        fetchAssets: vi.fn(async () => undefined),
      };
    });
    const fresh = await import('./utils');
    expect(fresh.useTranslations('es')('seeHere')).toBe(es.seeHere);
    const a = fresh.useAssets();
    expect(a.skill('react')).toBe('checkbox.svg');
    expect(a.image('portfolio', 'xlabs')).toBe('');
    expect(a.raw).toEqual({});
    vi.doUnmock('./ui');
    vi.resetModules();
  });
});
