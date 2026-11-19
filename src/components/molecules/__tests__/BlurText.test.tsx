import { MotionGlobalConfig } from 'motion';
import { render, screen, waitFor } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { intersectAll, observers } from '../../../test/io';
import BlurText from '../BlurText';

beforeAll(() => {
  MotionGlobalConfig.skipAnimations = true;
});
afterAll(() => {
  MotionGlobalConfig.skipAnimations = false;
});

const segments = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('p.blur-text > span')).map((s) => s.textContent);

describe('BlurText', () => {
  it('splits text into one animated span per word with non-breaking spaces between', () => {
    const { container } = render(<BlurText text="Hello big world" />);
    expect(segments(container)).toEqual(['Hello ', 'big ', 'world']);
  });

  it('splits by letters and turns spaces into non-breaking spaces', () => {
    const { container } = render(<BlurText text="Hi u" animateBy="letters" />);
    expect(segments(container)).toEqual(['H', 'i', ' ', 'u']);
  });

  it('renders nothing meaningful for empty text', () => {
    const { container } = render(<BlurText />);
    expect(segments(container)).toEqual(['']);
  });

  it('applies the custom className and disables translation', () => {
    const { container } = render(<BlurText text="x" className="title" />);
    const p = container.querySelector('p')!;
    expect(p).toHaveClass('blur-text', 'title');
    expect(p).toHaveAttribute('translate', 'no');
  });

  it('observes itself with the given threshold and rootMargin', () => {
    render(<BlurText text="watch me" threshold={0.5} rootMargin="10px" />);
    const [io] = observers();
    expect(io.options).toEqual({ threshold: 0.5, rootMargin: '10px' });
    expect(io.elements.size).toBe(1);
  });

  it('disconnects the observer on unmount', () => {
    const { unmount } = render(<BlurText text="bye" />);
    const [io] = observers();
    unmount();
    expect(io.elements.size).toBe(0);
  });

  it('fires onAnimationComplete once the last segment finishes after entering the viewport', async () => {
    const onDone = vi.fn();
    render(<BlurText text="one two" onAnimationComplete={onDone} direction="bottom" />);
    intersectAll(true);
    await waitFor(() => expect(onDone).toHaveBeenCalled());
    // leaving the viewport is handled without errors
    intersectAll(false);
    expect(screen.getByText(/two/)).toBeInTheDocument();
  });

  it('accepts custom keyframes', async () => {
    const onDone = vi.fn();
    render(
      <BlurText
        text="custom"
        animationFrom={{ opacity: 0 }}
        animationTo={[{ opacity: 1 }]}
        onAnimationComplete={onDone}
      />,
    );
    intersectAll(true);
    await waitFor(() => expect(onDone).toHaveBeenCalled());
  });
});
