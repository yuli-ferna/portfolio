// @vitest-environment node
import { describe, expect, it } from 'vitest';
import en from '../../../i18n/en.json';
import es from '../../../i18n/es.json';
import { islands, renderAstroDom } from '../../../test/astro';
import Footer from '../../organisms/Footer.astro';
import Navbar from '../../organisms/Navbar.astro';
import Timeline from '../../organisms/Timeline.astro';
import TimelineEdItem from '../../organisms/TimelineEdItem.astro';
import TimelineWorkItem from '../../organisms/TimelineWorkItem.astro';

const text = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

describe('Footer.astro', () => {
  it.each([
    ['en', en],
    ['es', es],
  ] as const)('renders translated footer content (%s)', async (lang, dict) => {
    const { doc } = await renderAstroDom(Footer, { lang });
    const footer = doc.querySelector('footer#footer')!;
    expect(text(footer)).toContain((dict as any).contact.myLinks);
    expect(text(footer)).toContain((dict as any).footer.builtWith);
    // happy-dom's parser keeps the `&copy;` entity verbatim; browsers render it as ©.
    expect(text(footer).replace('&copy;', '©')).toContain(`© ${new Date().getFullYear()} Yuliana Fernandez.`);
    expect(text(footer)).toContain((dict as any).footer.allRightsReserved);
  });

  it('links each credit to the right site', async () => {
    const { doc } = await renderAstroDom(Footer);
    const hrefFor = (label: string) =>
      Array.from(doc.querySelectorAll('a')).find((a) => text(a).includes(label))?.getAttribute('href');
    expect(hrefFor('Astro')).toBe('https://astro.build');
    expect(hrefFor('TailwindCSS')).toBe('https://tailwindcss.com');
    expect(hrefFor('CC BY 4.0')).toBe('https://creativecommons.org/licenses/by/4.0/');
  });

  it('opens every external link safely and gives images alt text', async () => {
    const { doc } = await renderAstroDom(Footer);
    doc.querySelectorAll('a[target="_blank"]').forEach((a) =>
      expect(a.getAttribute('rel')).toContain('noopener'),
    );
    doc.querySelectorAll('img').forEach((img) => expect(img.getAttribute('alt')).toBeTruthy());
  });
});

describe('Navbar.astro', () => {
  it('renders one labelled button per visible section', async () => {
    const { doc } = await renderAstroDom(Navbar);
    const buttons = Array.from(doc.querySelectorAll('#main-nav button.navbar-item'));
    expect(buttons.map((b) => b.getAttribute('data-section'))).toEqual([
      'home',
      'skills',
      'experience',
      'projects',
      'education',
      'contact',
    ]);
    buttons.forEach((b) => {
      expect(b.getAttribute('aria-label')).toBe(b.getAttribute('data-section'));
      expect(b.querySelector('svg')).not.toBeNull();
    });
  });

  it.each([
    ['en', en],
    ['es', es],
  ] as const)('shows a visible label under each icon (%s)', async (lang, dict) => {
    const { doc } = await renderAstroDom(Navbar, { lang, props: { lang } });
    const labels = Array.from(doc.querySelectorAll('#main-nav .navbar-label')).map(text);
    const nav = (dict as any).navbar;
    expect(labels).toEqual(['home', 'skills', 'experience', 'projects', 'education', 'contact'].map((s) => nav[s].name));
  });

  it.each([
    ['en', en],
    ['es', es],
  ] as const)('uses translated tooltips (%s)', async (lang, dict) => {
    const { doc } = await renderAstroDom(Navbar, { lang, props: { lang } });
    const title = (s: string) => doc.querySelector(`button[data-section="${s}"]`)!.getAttribute('title');
    expect(title('home')).toBe((dict as any).navbar.home.name);
    expect(title('contact')).toBe((dict as any).navbar.contact.name);
  });

  it('wires clicks via data-section instead of a positional list', async () => {
    const { doc, html } = await renderAstroDom(Navbar);
    doc.querySelectorAll('button').forEach((b) => expect(b.hasAttribute('onclick')).toBe(false));
    expect(html).toContain('dataset.section');
  });

  it('scrolls to the section of the clicked button when the script runs', async () => {
    const { Window } = await import('happy-dom');
    const { html } = await renderAstroDom(Navbar);
    const window = new Window({ url: 'https://example.com/', settings: { disableJavaScriptEvaluation: false } });
    const document = window.document;
    const sections = ['home', 'skills', 'experience', 'education', 'contact']
      .map((id, i) => `<section id="${id}" data-top="${(i + 1) * 100}"></section>`)
      .join('');
    document.write(`<!doctype html><html><body>${sections}${html}</body></html>`);
    document.querySelectorAll('section').forEach((s) =>
      Object.defineProperty(s, 'offsetTop', { value: Number(s.getAttribute('data-top')) }),
    );
    const calls: unknown[] = [];
    (window as any).scrollTo = (opts: unknown) => calls.push(opts);
    await window.happyDOM.waitUntilComplete();

    (document.querySelector('button[data-section="education"]') as any).click();
    expect(calls.at(-1)).toEqual({ top: 400 });
    expect(document.querySelector('button[data-section="education"]')!.classList.contains('active')).toBe(true);

    (document.querySelector('button[data-section="contact"]') as any).click();
    expect(calls.at(-1)).toEqual({ top: 500 });
    expect(document.querySelector('button[data-section="education"]')!.classList.contains('active')).toBe(false);
    await window.happyDOM.close();
  });
});

describe('TimelineWorkItem.astro', () => {
  const xlabs = en.experience.positions.find((p) => p.companyName === 'xLabs')!;

  it('renders the job details', async () => {
    const { doc } = await renderAstroDom(TimelineWorkItem, { props: xlabs });
    expect(text(doc.body)).toContain(xlabs.jobTitle);
    expect(text(doc.body)).toContain(xlabs.companyName);
    expect(text(doc.body)).toContain(xlabs.ubication);
    expect(text(doc.querySelector('.time-date'))).toBe(`${xlabs.dateStart} - ${xlabs.dateEnd}`);
    const img = doc.querySelector('img')!;
    expect(img.getAttribute('src')).toBe(`/${xlabs.image}`);
    expect(img.getAttribute('alt')).toBe(xlabs.companyName);
  });

  it('renders repo and project links with their labels', async () => {
    const { doc } = await renderAstroDom(TimelineWorkItem, { props: xlabs });
    const links = Array.from(doc.querySelectorAll('a.button'));
    const expected = [...xlabs.github!, ...xlabs.projects!];
    expect(links.map((a) => a.getAttribute('href'))).toEqual(expected.map((l) => l.link));
    expect(links.map(text)).toEqual(expected.map((l) => l.text));
  });

  it('falls back to default labels when links have no text', async () => {
    const props = {
      ...xlabs,
      github: [{ text: '', link: 'https://github.com/x' }],
      projects: [{ text: '', link: 'https://x.dev' }],
    };
    const { doc } = await renderAstroDom(TimelineWorkItem, { props, lang: 'es' });
    const labels = Array.from(doc.querySelectorAll('a.button')).map(text);
    expect(labels).toEqual(['Repo', es.seeHere]);
  });

  it('keeps remote image URLs untouched', async () => {
    const props = { ...xlabs, image: 'https://cdn.example.com/a.webp', github: undefined, projects: undefined };
    const { doc } = await renderAstroDom(TimelineWorkItem, { props });
    expect(doc.querySelector('img')!.getAttribute('src')).toBe('https://cdn.example.com/a.webp');
    expect(doc.querySelectorAll('a.button')).toHaveLength(0);
  });

  it('hydrates the description and renders tags', async () => {
    const { doc } = await renderAstroDom(TimelineWorkItem, { props: xlabs });
    const names = islands(doc).map((i) => i.opts.name);
    expect(names).toContain('Description');
    expect(names.filter((n) => n === 'Tag')).toHaveLength(xlabs.tags.length);
  });
});

describe('TimelineEdItem.astro', () => {
  const [degree, course] = en.education.titles;

  it('renders the education entry', async () => {
    const { doc } = await renderAstroDom(TimelineEdItem, { props: degree });
    expect(text(doc.body)).toContain(degree.title);
    expect(text(doc.body)).toContain(degree.companyName);
    expect(doc.querySelector('img')!.getAttribute('alt')).toBe(degree.title);
    expect(doc.querySelector('a')).toBeNull(); // no certificate
  });

  it.each([
    ['en', en],
    ['es', es],
  ] as const)('links to the certificate with a translated label (%s)', async (lang, dict) => {
    const { doc } = await renderAstroDom(TimelineEdItem, { props: course, lang });
    const link = doc.querySelector('a')!;
    expect(link.getAttribute('href')).toBe(course.certificate);
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(text(link)).toBe((dict as any).education.seeCertificate);
  });
});

describe('Timeline.astro', () => {
  it('renders one entry per work position', async () => {
    const items = en.experience.positions;
    const { doc } = await renderAstroDom(Timeline, { props: { items, type: 'work' } });
    expect(doc.querySelectorAll('.time-item')).toHaveLength(items.length);
    expect(doc.querySelectorAll('.time-point')).toHaveLength(items.length);
  });

  it('renders one entry per education item', async () => {
    const items = en.education.titles;
    const { doc } = await renderAstroDom(Timeline, { props: { items, type: 'education' } });
    expect(doc.querySelectorAll('.time-item')).toHaveLength(items.length);
  });

  it('draws a connector line between items but not after the last one', async () => {
    const items = en.education.titles;
    const { doc } = await renderAstroDom(Timeline, { props: { items, type: 'education' } });
    const connectors = islands(doc).filter((i) => i.el.querySelector('.bg-primary.absolute'));
    expect(connectors).toHaveLength(items.length - 1);
  });

  it('renders nothing for an empty list', async () => {
    const { doc } = await renderAstroDom(Timeline, { props: { items: [] } });
    expect(doc.querySelectorAll('.time-item')).toHaveLength(0);
  });
});
