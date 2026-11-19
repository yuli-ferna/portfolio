import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { create, registerPlugin } = vi.hoisted(() => ({
  create: vi.fn(),
  registerPlugin: vi.fn(),
}));

vi.mock('gsap', () => ({ default: { registerPlugin }, gsap: { registerPlugin } }));
vi.mock('gsap/Draggable', () => ({ Draggable: { create } }));

import DragConstraints from '../SkillDrag';

// Captured right after import: restoreMocks clears call history before each test.
const registerCalls = [...registerPlugin.mock.calls];

const skills = { title: 'Skills', description: 'What I work with' };
const skillsList = [
  { name: 'Frontend', items: ['React', 'Astro'] },
  { name: 'Backend', items: ['NodeJS'] },
  { name: 'Soft skills', items: ['Teamwork'], soft: true },
];

const setViewport = (width: number, reducedMotion: boolean) => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  vi.stubGlobal(
    'matchMedia',
    vi.fn((q: string) => ({
      matches: !reducedMotion && q.includes('no-preference'),
      media: q,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  );
};

describe('SkillDrag (DragConstraints)', () => {
  const originalWidth = window.innerWidth;
  beforeEach(() => {
    create.mockClear();
  });
  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalWidth });
  });

  it('registers the Draggable plugin at import time', async () => {
    // module-level side effect; check it ran with the Draggable plugin object
    const { Draggable } = await import('gsap/Draggable');
    expect(registerCalls).toContainEqual([Draggable]);
  });

  it('renders the heading, description and one card per skill group', () => {
    setViewport(1400, false);
    const { container } = render(<DragConstraints skills={skills} skillsList={skillsList} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Skills');
    expect(screen.getByText('What I work with')).toBeInTheDocument();
    expect(container.querySelectorAll('.skill-item')).toHaveLength(3);
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Soft skills')).toBeInTheDocument();
  });

  it('gives each card its desktop position class', () => {
    setViewport(1400, false);
    const { container } = render(<DragConstraints skills={skills} skillsList={skillsList} />);
    const cards = container.querySelectorAll('.skill-item');
    expect(cards[0]).toHaveClass('min-[1320px]:top-60');
    expect(cards[1]).toHaveClass('min-[1320px]:bottom-15');
  });

  it('makes cards draggable within the container on wide screens', () => {
    setViewport(1400, false);
    const { container } = render(<DragConstraints skills={skills} skillsList={skillsList} />);
    expect(create).toHaveBeenCalledTimes(1);
    const [selector, opts] = create.mock.calls[0];
    expect(selector).toBe('.skill-item');
    expect(opts.bounds).toBe(container.firstElementChild);
    expect(opts.type).toBe('x,y');
  });

  it('adds a shadow while dragging and removes it afterwards', () => {
    setViewport(1400, false);
    render(<DragConstraints skills={skills} skillsList={skillsList} />);
    const opts = create.mock.calls[0][1];
    const target = document.createElement('div');
    target.className = 'skill-item';
    opts.onDragStart.call({ target });
    expect(target.className).toBe('skill-item shadow-lg/80');
    opts.onDragEnd.call({ target });
    expect(target.className).toBe('skill-item');
  });

  it('does not enable dragging on small screens', () => {
    setViewport(500, false);
    render(<DragConstraints skills={skills} skillsList={skillsList} />);
    expect(create).not.toHaveBeenCalled();
  });

  it('respects prefers-reduced-motion', () => {
    setViewport(1400, true);
    render(<DragConstraints skills={skills} skillsList={skillsList} />);
    expect(create).not.toHaveBeenCalled();
  });
});
