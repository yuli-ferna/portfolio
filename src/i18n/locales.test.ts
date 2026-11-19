import { describe, expect, it } from 'vitest';
import en from './en.json';
import es from './es.json';
import assets from './assets.json';

type Json = unknown;

/** Collects every key path of a JSON value; array items are indexed. */
function keyPaths(value: Json, prefix: string[] = []): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((v, i) => keyPaths(v, [...prefix, `[${i}]`]));
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => {
      const path = [...prefix, k];
      return [JSON.stringify(path), ...keyPaths(v, path)];
    });
  }
  return [];
}

/**
 * Keys that exist in only one locale on purpose (or are known dead data).
 * `home.description` nested inside `home` is unused: pages read the top-level
 * "home.description" key instead.
 */
const KNOWN_ONLY_IN_ES = [JSON.stringify(['home', 'description'])];

describe('locale files', () => {
  const enPaths = new Set(keyPaths(en));
  const esPaths = new Set(keyPaths(es));

  it('every English key exists in Spanish', () => {
    const missing = [...enPaths].filter((p) => !esPaths.has(p));
    expect(missing).toEqual([]);
  });

  it('every Spanish key exists in English (except documented extras)', () => {
    const extra = [...esPaths].filter((p) => !enPaths.has(p) && !KNOWN_ONLY_IN_ES.includes(p));
    expect(extra).toEqual([]);
  });

  it('has no empty translation strings', () => {
    const empties: string[] = [];
    const walk = (v: Json, path: string, lang: string) => {
      if (typeof v === 'string' && v.trim() === '') empties.push(`${lang}:${path}`);
      else if (v && typeof v === 'object')
        Object.entries(v).forEach(([k, c]) => walk(c, `${path}.${k}`, lang));
    };
    walk(en, '', 'en');
    walk(es, '', 'es');
    expect(empties).toEqual([]);
  });

  it.each([
    ['en', en],
    ['es', es],
  ])('%s: "home.description" keeps the {years} placeholder', (_lang, dict) => {
    expect((dict as Record<string, string>)['home.description']).toContain('{years}');
  });

  it.each([
    ['en', en],
    ['es', es],
  ])('%s: navbar entries map to their own section id', (_lang, dict) => {
    const navbar = (dict as any).navbar as Record<string, { name: string; section: string }>;
    for (const [key, item] of Object.entries(navbar)) {
      expect(item.section).toBe(key);
      expect(item.name).toBeTruthy();
    }
  });

  it.each([
    ['en', en],
    ['es', es],
  ])('%s: contact links are absolute URLs', (_lang, dict) => {
    const links = (dict as any).contact.links as Record<string, { link: string }>;
    for (const { link } of Object.values(links)) {
      expect(link).toMatch(/^(https?:|mailto:)/);
    }
  });

  it.each([
    ['en', en],
    ['es', es],
  ])('%s: every skill category has a name and items', (_lang, dict) => {
    for (const group of (dict as any).skills.skillsList) {
      expect(group.name).toBeTruthy();
      expect(Array.isArray(group.items)).toBe(true);
      expect(group.items.length).toBeGreaterThan(0);
    }
  });
});

describe('assets manifest', () => {
  it('has the expected top-level groups', () => {
    expect(Object.keys(assets).sort()).toEqual(['footer', 'images', 'skills', 'social']);
  });

  it('every social link in the locales has an icon', () => {
    for (const name of Object.keys((en as any).contact.links)) {
      expect((assets.social as Record<string, string>)[name]).toBeTruthy();
    }
  });
});
