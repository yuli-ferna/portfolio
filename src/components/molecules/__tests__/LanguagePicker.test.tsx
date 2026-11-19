import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import LanguagePicker from '../LanguagePicker';

vi.mock('astro:transitions/client', () => ({ navigate: vi.fn() }));

const goTo = (path: string) => window.history.pushState({}, '', path);

describe('LanguagePicker', () => {
  afterEach(() => goTo('/'));

  it('on the English home page it links to the Spanish home page', () => {
    goTo('/');
    render(<LanguagePicker lang="en" />);
    const link = screen.getByRole('link', { name: 'Change language' });
    expect(link).toHaveTextContent('ES');
    expect(link).toHaveAttribute('href', '/es/');
  });

  it('on the Spanish home page it links to the English home page', () => {
    goTo('/es/');
    render(<LanguagePicker lang="es" />);
    const link = screen.getByRole('link', { name: 'Cambiar idioma' });
    expect(link).toHaveTextContent('EN');
    expect(link).toHaveAttribute('href', '/');
  });

  it('keeps the current sub-path when switching from English', () => {
    goTo('/blog/post');
    render(<LanguagePicker lang="en" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/es/blog/post');
  });

  it('keeps the current sub-path when switching from Spanish', () => {
    goTo('/es/blog/post');
    render(<LanguagePicker lang="es" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/post');
  });

  it('forces a full reload so the server-rendered locale is used', () => {
    render(<LanguagePicker lang="en" />);
    expect(screen.getByRole('link')).toHaveAttribute('data-astro-reload');
  });

  it('updates the link when the lang prop changes', () => {
    goTo('/');
    const { rerender } = render(<LanguagePicker lang="en" />);
    expect(screen.getByRole('link')).toHaveTextContent('ES');
    goTo('/es/');
    rerender(<LanguagePicker lang="es" />);
    expect(screen.getByRole('link')).toHaveTextContent('EN');
    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
  });

  it.each([
    ['en', 'EN', 'ES'],
    ['es', 'ES', 'EN'],
  ])('highlights the current language and links only the other one (%s)', (lang, current, other) => {
    goTo(lang === 'es' ? '/es/' : '/');
    const { container } = render(<LanguagePicker lang={lang} />);
    const active = container.querySelector('[aria-current="true"]')!;
    expect(active).toHaveTextContent(current);
    expect(active.tagName).toBe('SPAN');
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link')).toHaveTextContent(other);
    expect(screen.getByRole('link')).toHaveAttribute('hreflang', other.toLowerCase());
  });
});
