import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const m = vi.hoisted(() => {
  const tl = { set: vi.fn(), to: vi.fn(), kill: vi.fn() };
  const splitter = {
    chars: [] as HTMLElement[],
    words: [] as HTMLElement[],
    lines: [] as HTMLElement[],
    revert: vi.fn(),
  };
  const timelineOpts: any[] = [];
  return {
    tl,
    splitter,
    timelineOpts,
    gsap: {
      registerPlugin: vi.fn(),
      timeline: vi.fn((opts: any) => {
        timelineOpts.push(opts);
        return tl;
      }),
      set: vi.fn(),
      killTweensOf: vi.fn(),
    },
    SplitTextCtor: vi.fn(),
    triggers: [{ kill: vi.fn() }],
  };
});

vi.mock('gsap', () => ({ gsap: m.gsap, default: m.gsap }));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { getAll: () => m.triggers } }));
vi.mock('gsap/SplitText', () => ({
  SplitText: function (this: unknown, el: HTMLElement, opts: unknown) {
    m.SplitTextCtor(el, opts);
    return m.splitter;
  },
}));

import SplitText from '../SplitText';

const makeEls = (n: number) => Array.from({ length: n }, () => document.createElement('span'));

describe('SplitText', () => {
  beforeEach(() => {
    m.timelineOpts.length = 0;
    m.splitter.chars = makeEls(3);
    m.splitter.words = makeEls(2);
    m.splitter.lines = makeEls(1);
  });

  it('renders the text in a paragraph with alignment and class', () => {
    render(<SplitText text="Hello" className="x" textAlign="left" />);
    const p = screen.getByText('Hello');
    expect(p.tagName).toBe('P');
    expect(p).toHaveClass('split-parent', 'x');
    expect(p).toHaveStyle({ textAlign: 'left' });
  });

  it('splits by chars and animates them with a scroll-triggered timeline', () => {
    render(<SplitText text="Hey" />);
    expect(m.SplitTextCtor).toHaveBeenCalledWith(
      screen.getByText('Hey'),
      expect.objectContaining({ type: 'chars', absolute: false }),
    );
    const opts = m.timelineOpts[0];
    expect(opts.scrollTrigger.start).toBe('top 90%-=100px');
    expect(opts.scrollTrigger.once).toBe(true);
    expect(m.tl.set).toHaveBeenCalledWith(m.splitter.chars, expect.objectContaining({ opacity: 0, y: 40 }));
    expect(m.tl.to).toHaveBeenCalledWith(
      m.splitter.chars,
      expect.objectContaining({ opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }),
    );
    m.splitter.chars.forEach((c) => expect(c.style.willChange).toBe('transform, opacity'));
  });

  it.each([
    ['words', () => m.splitter.words],
    ['lines', () => m.splitter.lines],
    ['words, chars', () => [...m.splitter.words, ...m.splitter.chars]],
  ] as const)('targets %s', (splitType, targets) => {
    render(<SplitText text="t" splitType={splitType} />);
    expect(m.tl.to).toHaveBeenLastCalledWith(targets(), expect.anything());
  });

  it('positions the parent relatively when splitting lines', () => {
    render(<SplitText text="lines" splitType="lines" />);
    expect(screen.getByText('lines').style.position).toBe('relative');
  });

  it('builds the start position from threshold and a positive rootMargin', () => {
    render(<SplitText text="t" threshold={0.5} rootMargin="20px" />);
    expect(m.timelineOpts[0].scrollTrigger.start).toBe('top 50%+=20px');
  });

  it('ignores a rootMargin that is not in px', () => {
    render(<SplitText text="t" rootMargin="10%" />);
    expect(m.timelineOpts[0].scrollTrigger.start).toBe('top 90%+=0px');
  });

  it('calls onLetterAnimationComplete when the timeline completes', () => {
    const done = vi.fn();
    render(<SplitText text="t" onLetterAnimationComplete={done} />);
    m.timelineOpts[0].onComplete();
    expect(done).toHaveBeenCalled();
    expect(m.gsap.set).toHaveBeenCalledWith(m.splitter.chars, expect.objectContaining({ clearProps: 'willChange' }));
  });

  it('cleans up the timeline, triggers and split on unmount', () => {
    const { unmount } = render(<SplitText text="t" />);
    unmount();
    expect(m.tl.kill).toHaveBeenCalled();
    expect(m.triggers[0].kill).toHaveBeenCalled();
    expect(m.gsap.killTweensOf).toHaveBeenCalled();
    expect(m.splitter.revert).toHaveBeenCalled();
  });
});
