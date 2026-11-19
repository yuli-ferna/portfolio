import { act, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { intersectAll, observers } from '../../../test/io';
import DecryptedText from '../DecryptedText';

const srText = (c: HTMLElement) => c.querySelector('.sr-only')!.textContent;
const visibleText = (c: HTMLElement) => c.querySelector('[aria-hidden="true"]')!.textContent;
const tick = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

describe('DecryptedText', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('initially shows the plain text for screen readers and sighted users', () => {
    const { container } = render(<DecryptedText text="Hello" />);
    expect(srText(container)).toBe('Hello');
    expect(visibleText(container)).toBe('Hello');
    expect(container.querySelector('[aria-hidden="true"]')!.children).toHaveLength(5);
  });

  it('scrambles on hover and settles back to the original after maxIterations', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // always picks the first char 'A'
    const { container } = render(<DecryptedText text="ab cd" speed={10} maxIterations={3} />);
    const root = container.firstElementChild!;

    fireEvent.mouseEnter(root);
    tick(10);
    expect(visibleText(container)).toBe('AA AA'); // spaces preserved
    tick(30);
    expect(visibleText(container)).toBe('ab cd');
  });

  it('restores the text immediately on mouse leave', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { container } = render(<DecryptedText text="abc" speed={10} maxIterations={100} />);
    const root = container.firstElementChild!;
    fireEvent.mouseEnter(root);
    tick(20);
    expect(visibleText(container)).toBe('AAA');
    fireEvent.mouseLeave(root);
    expect(visibleText(container)).toBe('abc');
  });

  it('applies encryptedClassName to scrambled characters and className to settled ones', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { container } = render(
      <DecryptedText text="ab" speed={10} maxIterations={100} className="done" encryptedClassName="enc" />,
    );
    const chars = () => Array.from(container.querySelectorAll('[aria-hidden="true"] > span'));
    expect(chars().every((c) => c.className === 'done')).toBe(true);
    fireEvent.mouseEnter(container.firstElementChild!);
    tick(10);
    expect(chars().every((c) => c.className === 'enc')).toBe(true);
  });

  it('sequentially reveals characters from the start', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { container } = render(<DecryptedText text="abc" speed={10} sequential />);
    fireEvent.mouseEnter(container.firstElementChild!);
    tick(10);
    expect(visibleText(container)).toBe('aAA');
    tick(10);
    expect(visibleText(container)).toBe('abA');
    tick(10);
    expect(visibleText(container)).toBe('abc');
    tick(50);
    expect(visibleText(container)).toBe('abc');
  });

  it('sequentially reveals characters from the end', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { container } = render(<DecryptedText text="abc" speed={10} sequential revealDirection="end" />);
    fireEvent.mouseEnter(container.firstElementChild!);
    tick(10);
    expect(visibleText(container)).toBe('AAc');
    tick(10);
    expect(visibleText(container)).toBe('Abc');
  });

  it('sequentially reveals characters from the center outwards', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { container } = render(<DecryptedText text="abcd" speed={10} sequential revealDirection="center" />);
    fireEvent.mouseEnter(container.firstElementChild!);
    tick(10);
    expect(visibleText(container)).toBe('AAcA');
    tick(10);
    expect(visibleText(container)).toBe('AbcA');
    tick(20);
    expect(visibleText(container)).toBe('abcd');
  });

  it('only uses characters from the original text when useOriginalCharsOnly is set', () => {
    const { container } = render(
      <DecryptedText text="aab b" speed={10} maxIterations={100} useOriginalCharsOnly />,
    );
    fireEvent.mouseEnter(container.firstElementChild!);
    tick(30);
    const shown = visibleText(container)!;
    expect(shown).toHaveLength(5);
    expect(shown[3]).toBe(' ');
    expect(shown.replace(/ /g, '').split('').sort().join('')).toBe('aabb');
  });

  it('keeps revealed characters in place with useOriginalCharsOnly + sequential', () => {
    const { container } = render(
      <DecryptedText text="xyz" speed={10} sequential useOriginalCharsOnly />,
    );
    fireEvent.mouseEnter(container.firstElementChild!);
    tick(10);
    expect(visibleText(container)![0]).toBe('x');
    tick(20);
    expect(visibleText(container)).toBe('xyz');
  });

  it('does not react to hover when animateOn="view", and animates once when scrolled into view', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { container } = render(
      <DecryptedText text="abc" speed={10} maxIterations={2} animateOn="view" />,
    );
    fireEvent.mouseEnter(container.firstElementChild!);
    tick(10);
    expect(visibleText(container)).toBe('abc');

    expect(observers().length).toBeGreaterThan(0);
    intersectAll(true);
    tick(10);
    expect(visibleText(container)).toBe('AAA');
    tick(20);
    expect(visibleText(container)).toBe('abc');
  });

  it('forwards extra props to the root element', () => {
    const { container } = render(
      <DecryptedText text="x" parentClassName="parent" data-testid="root" />,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('parent');
    expect(root).toHaveAttribute('data-testid', 'root');
    expect(root).toHaveAttribute('translate', 'no');
  });

  it('stops its interval on unmount', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval');
    const { container, unmount } = render(<DecryptedText text="abc" speed={10} maxIterations={100} />);
    fireEvent.mouseEnter(container.firstElementChild!);
    unmount();
    expect(clearSpy).toHaveBeenCalled();
  });
});
