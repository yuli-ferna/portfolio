// @vitest-environment node
import { describe, expect, it } from 'vitest';
import en from '../../../i18n/en.json';
import es from '../../../i18n/es.json';
import { islands, renderAstroDom } from '../../../test/astro';
import Contact from '../../template/Contact.astro';
import Education from '../../template/Education.astro';
import Experience from '../../template/Experience.astro';
import Home from '../../template/Home.astro';
import Playground from '../../template/Playground.astro';
import Projects from '../../template/Projects.astro';
import Skills from '../../template/Skills.astro';

const text = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
const locales = [
  ['en', en],
  ['es', es],
] as const;

describe('Home.astro', () => {
  it.each(locales)('shows the greeting, name, roles and experience years (%s)', async (lang, dict) => {
    const { doc } = await renderAstroDom(Home, { lang });
    const body = text(doc.body);
    expect(body).toContain((dict.home as any).greeting);
    expect(text(doc.querySelector('h1.hero-name'))).toBe('Yuliana Fernandez');
    dict.home.titles.forEach((title) => expect(body).toContain(title));

    const years = new Date().getFullYear() - 2018;
    const blur = islands(doc).find((i) => i.opts.name === 'BlurText')!;
    expect(text(blur.el)).toContain(String(years));
    expect(text(blur.el)).not.toContain('{years}');
  });

  it.each(locales)('links the CV button to the locale CV and "let\'s talk" to #contact (%s)', async (lang, dict) => {
    const { doc } = await renderAstroDom(Home, { lang });
    const [cv, talk] = Array.from(doc.querySelectorAll('.hero-ctas a'));
    expect(cv.getAttribute('href')).toBe(dict.home.cvLink);
    expect(cv.getAttribute('target')).toBe('_blank');
    expect(cv.getAttribute('rel')).toContain('noopener');
    expect(text(cv)).toContain((dict.home as any).cvLabel);
    expect(talk.getAttribute('href')).toBe('#contact');
    expect(text(talk)).toContain((dict.home as any).talkLabel);
  });

  it.each(locales)('shows the stats row with years and distinct companies (%s)', async (lang, dict) => {
    const { doc } = await renderAstroDom(Home, { lang });
    const stats = Array.from(doc.querySelectorAll('.hero-stat')).map((el) => ({
      label: text(el.querySelector('dt')),
      value: text(el.querySelector('dd')),
    }));
    const companies = new Set(dict.experience.positions.map((p) => p.companyName)).size;
    const labels = (dict.home as any).stats;
    expect(stats).toEqual([
      { label: labels.years, value: `${new Date().getFullYear() - 2018}+` },
      { label: labels.companies, value: String(companies) },
      { label: labels.remote, value: '100%' },
    ]);
  });

  it.each(locales)('keeps the ID card with the translated status (%s)', async (lang, dict) => {
    const { doc } = await renderAstroDom(Home, { lang });
    expect(text(doc.querySelector('.card-header-title'))).toBe((dict.home as any).status);
  });

  it('uses symbols instead of emojis in the decorations and ticker', async () => {
    const { doc } = await renderAstroDom(Home);
    const deco = text(doc.querySelector('.pixel-floats')) + text(doc.querySelector('.pixel-ticker'));
    expect(deco).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2B50}]/u);
    expect(deco).toContain('✦');
    expect(doc.querySelector('.pixel-ticker .px-ok')).not.toBeNull();
  });

  it('renders the avatar with alt text and hides decorations from assistive tech', async () => {
    const { doc } = await renderAstroDom(Home);
    expect(doc.querySelector('img[alt="Avatar"]')!.getAttribute('src')).toBe('/image_home.webp');
    ['.pixel-floats', '.pixel-ticker', '.card-barcode'].forEach((sel) =>
      expect(doc.querySelector(sel)!.getAttribute('aria-hidden')).toBe('true'),
    );
  });

  it('includes the contact links', async () => {
    const { doc } = await renderAstroDom(Home);
    const hrefs = Array.from(doc.querySelectorAll('.card-links a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(Object.values(en.contact.links).map((l) => l.link));
  });
});

describe('Skills.astro', () => {
  it('mounts the draggable skills board as a client-only island', async () => {
    const { doc } = await renderAstroDom(Skills);
    const [island] = islands(doc);
    expect(island.opts.name).toBe('DragConstraints');
    expect(island.client).toBe('only');
  });
});

describe('Experience.astro', () => {
  it.each(locales)('renders the intro and a meta line with the start year and role count (%s)', async (lang, dict) => {
    const { doc } = await renderAstroDom(Experience, { lang });
    expect(text(doc.querySelector('h2'))).toBe(dict.experience.title);
    expect(text(doc.body)).toContain(dict.experience.description);
    const positions = dict.experience.positions;
    const meta = text(doc.querySelector('.exp-meta'));
    expect(meta).toContain(positions[positions.length - 1].dateStart.slice(-4));
    expect(meta).toContain(String(positions.length));
    expect(meta).not.toMatch(/\{start\}|\{count\}/);
  });

  it.each(locales)('features the latest role and collapses the rest (%s)', async (lang, dict) => {
    const { doc } = await renderAstroDom(Experience, { lang });
    const [latest, ...rest] = dict.experience.positions;
    const featured = doc.querySelector('.exp-featured')!;
    expect(text(featured.querySelector('.exp-title'))).toBe(`${latest.jobTitle} · ${latest.companyName}`);
    expect(featured.querySelector('img')!.getAttribute('alt')).toBe(latest.companyName);

    const rows = Array.from(doc.querySelectorAll('details.exp-row'));
    expect(rows).toHaveLength(rest.length);
    rows.forEach((row, i) => {
      expect(row.hasAttribute('open')).toBe(false);
      expect(text(row.querySelector('summary'))).toContain(rest[i].companyName);
      expect(text(row.querySelector('.exp-row-body'))).toContain(rest[i].description);
    });
  });

  it.each(locales)('groups the rows as an accordion with an "expand all" check (%s)', async (lang, dict) => {
    const { doc, html } = await renderAstroDom(Experience, { lang });
    doc.querySelectorAll('details.exp-row').forEach((row) =>
      expect(row.getAttribute('name')).toBe('experience'),
    );
    const expand = doc.querySelector('label.exp-expand')!;
    expect(expand.querySelector('input[type="checkbox"]')).not.toBeNull();
    expect(text(expand)).toBe((dict.experience as any).expandAll);
    expect(html).toContain('removeAttribute("name")');
  });

  it('renders every tag and opens external links safely', async () => {
    const { doc } = await renderAstroDom(Experience);
    const tagCount = en.experience.positions.reduce((n, p) => n + p.tags.length, 0);
    expect(doc.querySelectorAll('.tech-tag')).toHaveLength(tagCount);
    const xlabs = en.experience.positions.find((p) => p.companyName === 'xLabs')!;
    const hrefs = Array.from(doc.querySelectorAll('.exp-links a')).map((a) => a.getAttribute('href'));
    [...xlabs.projects!, ...xlabs.github!].forEach((l) => expect(hrefs).toContain(l.link));
    doc.querySelectorAll('.exp-links a').forEach((a) => {
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.getAttribute('rel')).toContain('noopener');
    });
  });

  it('draws a themed icon only for tags with a known skill icon', async () => {
    const { doc } = await renderAstroDom(Experience);
    const tag = (name: string) =>
      Array.from(doc.querySelectorAll('.tech-tag')).find((el) => text(el) === name)!;
    expect(tag('React').querySelector('.tech-tag-icon')!.getAttribute('style')).toContain('/react.svg');
    expect(tag('Web3').querySelector('.tech-tag-icon')).toBeNull();
  });
});

describe('Projects.astro', () => {
  it.each(locales)('renders the translated project cards (%s)', async (lang, dict) => {
    const { doc } = await renderAstroDom(Projects, { lang });
    const projects = dict.projects as any;
    expect(text(doc.querySelector('.projects-title'))).toBe(projects.title);
    expect(text(doc.querySelector('.section-desc'))).toBe(projects.description);
    const cards = Array.from(doc.querySelectorAll('.prj-card'));
    expect(cards).toHaveLength(projects.list.length);
    cards.forEach((card, i) => {
      const p = projects.list[i];
      expect(text(card.querySelector('.prj-title'))).toBe(p.title);
      expect(card.querySelector('img')!.getAttribute('alt')).toBe(p.title);
      const hrefs = Array.from(card.querySelectorAll('.prj-links a')).map((a) => a.getAttribute('href'));
      expect(hrefs).toEqual((p.links ?? []).map((l: any) => l.link));
      if (p.private) expect(text(card.querySelector('.prj-private'))).toBe(p.private);
    });
  });

  it.each(locales)('links the projects.exe portal to the projects site (%s)', async (lang, dict) => {
    const { doc } = await renderAstroDom(Projects, { lang });
    const portal = doc.querySelector('a.portal')!;
    expect(portal.getAttribute('href')).toBe('https://yuli-ferna.github.io/');
    expect(portal.getAttribute('rel')).toContain('noopener');
    expect(text(portal)).toContain((dict.projects as any).portal.title);
    expect(text(portal.querySelector('.portal-btn'))).toContain((dict.projects as any).portal.cta);
  });
});

describe('Education.astro', () => {
  it.each(locales)('renders the degree as a filled card and courses as outlined cards (%s)', async (lang, dict) => {
    const { doc } = await renderAstroDom(Education, { lang });
    expect(text(doc.querySelector('h2'))).toBe(dict.education.title);
    expect(text(doc.body)).toContain(dict.education.description);
    const cards = Array.from(doc.querySelectorAll('.edu-card'));
    expect(cards).toHaveLength(dict.education.titles.length);
    cards.forEach((card, i) => {
      const item = dict.education.titles[i] as any;
      expect(text(card.querySelector('.edu-title'))).toBe(item.title);
      expect(card.classList.contains('edu-degree')).toBe(item.type === 'education');
      const cert = card.querySelector('a.edu-cert');
      expect(cert?.getAttribute('href') ?? undefined).toBe(item.certificate);
    });
    expect(text(doc.querySelector('.edu-degree .edu-line'))).toContain(
      (dict.education as any).degreeLabel.toUpperCase(),
    );
  });
});

describe('Playground.astro', () => {
  it.each(locales)('renders the intro and mounts the terminal with real data (%s)', async (lang, dict) => {
    const { doc } = await renderAstroDom(Playground, { lang });
    const pg = (dict as any).playground;
    expect(text(doc.querySelector('h2'))).toBe(pg.title);
    expect(text(doc.body)).toContain('sudo hire-me');

    const terminal = islands(doc).find((i) => i.opts.name === 'Terminal')!;
    expect(terminal.client).toBe('visible');
    expect(text(terminal.el.querySelector('[role="log"]'))).toContain(pg.welcome);
    expect(terminal.el.querySelector('input')!.getAttribute('aria-label')).toBe(pg.inputLabel);
    expect(Array.from(terminal.el.querySelectorAll('button')).map(text)).toEqual([
      'help', 'whoami', 'skills', 'experience', 'projects', 'contact', 'clear',
    ]);
  });
});

describe('Contact.astro', () => {
  it.each(locales)('renders the title, description, location and lazy contact form (%s)', async (lang, dict) => {
    const { doc } = await renderAstroDom(Contact, { lang });
    expect(text(doc.querySelector('h2'))).toBe(dict.contact.title);
    expect(text(doc.body)).toContain(dict.contact.description);
    expect(text(doc.body)).toContain('Caracas, Venezuela');
    const form = islands(doc).find((i) => i.opts.name === 'ContactForm')!;
    expect(form.client).toBe('visible');
    expect(form.el.querySelector('form')).not.toBeNull();
    expect(doc.querySelector('footer#footer')).not.toBeNull();
  });

  it.each(locales)('shows the email from the mail link with a copy button (%s)', async (lang, dict) => {
    const { doc } = await renderAstroDom(Contact, { lang });
    const email = decodeURIComponent(dict.contact.links.gmail.link.match(/[?&]to=([^&]+)/)![1]);
    expect(doc.querySelector('.contact-email-text')!.getAttribute('href')).toBe(`mailto:${email}`);
    const copy = doc.querySelector('button[data-copy]')!;
    expect(copy.getAttribute('data-copy')).toBe(email);
    expect(text(copy)).toBe((dict.contact as any).copy);
    expect(copy.getAttribute('data-copied')).toBe((dict.contact as any).copied);
  });

  it('links GitHub and LinkedIn', async () => {
    const { doc } = await renderAstroDom(Contact);
    const hrefs = Array.from(doc.querySelectorAll('.contact-socials a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual([en.contact.links.github.link, en.contact.links.linkedin.link]);
  });
});
