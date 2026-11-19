// @vitest-environment node
import { describe, expect, it } from 'vitest';
import en from '../../i18n/en.json';
import es from '../../i18n/es.json';
import { islands, renderAstroDom } from '../../test/astro';
import Layout from '../Layout.astro';
import IndexPage from '../../pages/index.astro';
import EsIndexPage from '../../pages/es/index.astro';

describe('Layout.astro', () => {
  it.each(['en', 'es'] as const)('sets <html lang> from the URL (%s)', async (lang) => {
    const { doc } = await renderAstroDom(Layout, { lang, slots: { default: '<p id="slot">content</p>' } });
    expect(doc.documentElement.getAttribute('lang')).toBe(lang);
    expect(doc.querySelector('#slot')!.textContent).toBe('content');
  });

  it('has the basic document metadata', async () => {
    const { doc } = await renderAstroDom(Layout);
    expect(doc.querySelector('meta[charset]')!.getAttribute('charset')).toBe('UTF-8');
    expect(doc.querySelector('meta[name="viewport"]')).not.toBeNull();
    expect(doc.querySelector('title')!.textContent).toBeTruthy();
    expect(doc.querySelector('meta[name="description"]')!.getAttribute('content')).toBeTruthy();
    expect(doc.querySelector('link[rel="icon"]')!.getAttribute('href')).toBe('/favicon.svg');
  });

  it('loads Google Fonts with font-display: swap', async () => {
    const { doc } = await renderAstroDom(Layout);
    const fonts = doc.querySelector('link[href^="https://fonts.googleapis.com/css2"]')!;
    expect(fonts.getAttribute('href')).toContain('display=swap');
  });

  it('renders the theme toggle, language picker, logo and navbar', async () => {
    const { doc } = await renderAstroDom(Layout);
    expect(doc.querySelector('#themeToggle')).not.toBeNull();
    expect(doc.querySelector('#main-nav')).not.toBeNull();
    const names = islands(doc).map((i) => i.opts.name);
    expect(names).toEqual(expect.arrayContaining(['LanguagePicker', 'Logo']));
  });
});

describe.each([
  ['/', IndexPage, 'en', en],
  ['/es/', EsIndexPage, 'es', es],
] as const)('page %s', (path, Page, lang, dict) => {
  it('renders in the right language', async () => {
    const { doc } = await renderAstroDom(Page, { path });
    expect(doc.documentElement.getAttribute('lang')).toBe(lang);
    expect(doc.body.textContent).toContain(dict.contact.title);
    expect(doc.body.textContent).toContain(dict.experience.title);
  });

  it('every navbar button targets a section that exists on the page', async () => {
    const { doc } = await renderAstroDom(Page, { path });
    const targets = Array.from(doc.querySelectorAll('#main-nav [data-section]')).map((b) =>
      b.getAttribute('data-section'),
    );
    expect(targets.length).toBeGreaterThan(0);
    targets.forEach((id) => expect(doc.getElementById(id!), `section #${id}`).not.toBeNull());
  });

  it('renders the sections in order', async () => {
    const { doc } = await renderAstroDom(Page, { path });
    const ids = Array.from(doc.querySelectorAll('main > section')).map((s) => s.id);
    expect(ids).toEqual(['home', 'skills', 'experience', 'projects', 'education', 'playground', 'contact']);
  });

  it('gives every content image an alt attribute', async () => {
    const { doc } = await renderAstroDom(Page, { path });
    doc.querySelectorAll('img').forEach((img) => expect(img.hasAttribute('alt')).toBe(true));
  });

  it('every icon-only link has an accessible name', async () => {
    const { doc } = await renderAstroDom(Page, { path });
    doc.querySelectorAll('a').forEach((a) => {
      const name = (a.getAttribute('aria-label') ?? a.textContent ?? '').trim();
      expect(name, a.outerHTML.slice(0, 120)).not.toBe('');
    });
  });
});
