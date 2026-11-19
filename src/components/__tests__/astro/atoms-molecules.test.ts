// @vitest-environment node
import { describe, expect, it } from 'vitest';
import en from '../../../i18n/en.json';
import es from '../../../i18n/es.json';
import { islands, renderAstroDom } from '../../../test/astro';
import DateTimeline from '../../atoms/DateTimeline.astro';
import TimePoint from '../../atoms/TimePoint.astro';
import ContactLinks from '../../molecules/ContactLinks.astro';
import TagContainer from '../../molecules/TagContainer.astro';
import ThemeIcon from '../../molecules/ThemeIcon.astro';

describe('DateTimeline.astro', () => {
  it('renders a date range', async () => {
    const { doc } = await renderAstroDom(DateTimeline, { props: { dateStart: 'May 2023', dateEnd: 'May 2025' } });
    expect(doc.querySelector('p.time-date')!.textContent!.replace(/\s+/g, ' ').trim()).toBe('May 2023 - May 2025');
  });

  it('renders only the start date when there is no end date', async () => {
    const { doc } = await renderAstroDom(DateTimeline, { props: { dateStart: 'Dec 2022' } });
    expect(doc.querySelector('p.time-date')!.textContent!.trim()).toBe('Dec 2022');
  });
});

describe('TimePoint.astro', () => {
  it('renders the given icon inside the round badge', async () => {
    const { doc } = await renderAstroDom(TimePoint, { props: { icon: '★' } });
    expect(doc.body.textContent).toContain('★');
    expect(doc.querySelector('div.rounded-\\[50px\\]')).not.toBeNull();
  });
});

describe('TagContainer.astro', () => {
  it('creates one client-only Tag island per item', async () => {
    const { doc } = await renderAstroDom(TagContainer, { props: { items: ['React', 'Astro', 'CSS'] } });
    const tags = islands(doc).filter((i) => i.opts.name === 'Tag');
    expect(tags).toHaveLength(3);
    tags.forEach((t) => expect(t.client).toBe('only'));
  });

  it('renders an empty container for no items', async () => {
    const { doc } = await renderAstroDom(TagContainer, { props: { items: [] } });
    expect(doc.querySelector('.tag-container')).not.toBeNull();
    expect(islands(doc)).toHaveLength(0);
  });
});

describe('ContactLinks.astro', () => {
  it.each([
    ['en', en],
    ['es', es],
  ] as const)('renders an accessible external link per contact link (%s)', async (lang, dict) => {
    const { doc } = await renderAstroDom(ContactLinks, { lang });
    const links = Array.from(doc.querySelectorAll('a'));
    const expected = Object.entries((dict as any).contact.links as Record<string, { link: string }>);
    expect(links).toHaveLength(expected.length);
    expected.forEach(([name, { link }], i) => {
      expect(links[i].getAttribute('href')).toBe(link);
      expect(links[i].getAttribute('aria-label')).toBe(`Go to ${name}`);
      expect(links[i].getAttribute('target')).toBe('_blank');
      expect(links[i].getAttribute('rel')).toBe('noopener noreferrer');
      expect(links[i].querySelector('svg')).not.toBeNull();
    });
  });
});

describe('ThemeIcon.astro', () => {
  it('renders the labelled toggle button and its theme script', async () => {
    const { doc, html } = await renderAstroDom(ThemeIcon);
    const button = doc.querySelector('#themeToggle')!;
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('aria-label')).toBe('Theme toggle');
    expect(button.querySelectorAll('svg').length).toBeGreaterThan(0);
    expect(html).toContain('localStorage');
    expect(html).toContain('data-theme');
  });
});
