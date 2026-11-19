import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TextPressure from '../TextPressure';

describe('TextPressure', () => {
  let rafCallbacks: FrameRequestCallback[];
  beforeEach(() => {
    rafCallbacks = [];
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((cb: FrameRequestCallback) => {
        rafCallbacks.push(cb);
        return rafCallbacks.length;
      }),
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    // keep the network disabled for the rest of the suite
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('network disabled in tests'))));
  });

  const flushFrames = (n = 1) => {
    for (let i = 0; i < n; i++) {
      const cbs = rafCallbacks.splice(0);
      act(() => cbs.forEach((cb) => cb(performance.now())));
    }
  };

  it('renders one span per character inside a heading', () => {
    render(<TextPressure text="Hello" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Hello');
    const spans = heading.querySelectorAll('span');
    expect(spans).toHaveLength(5);
    expect(spans[0]).toHaveAttribute('data-char', 'H');
  });

  it('uses the default text when none is given', () => {
    render(<TextPressure />);
    expect(screen.getByRole('heading')).toHaveTextContent('Compressa');
  });

  it('declares the variable font via @font-face', () => {
    const { container } = render(<TextPressure fontFamily="MyFont" fontUrl="https://cdn/font.woff2" />);
    const css = container.querySelector('style')!.textContent!;
    expect(css).toContain("font-family: 'MyFont'");
    expect(css).toContain("url('https://cdn/font.woff2')");
    expect(screen.getByRole('heading')).toHaveStyle({ fontFamily: 'MyFont' });
  });

  it('applies flex/stroke classes and colours', () => {
    render(<TextPressure text="ab" stroke flex className="extra" strokeColor="#00ff00" />);
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('text-pressure-title', 'extra', 'flex', 'stroke');
  });

  it('omits flex when disabled and colours characters directly without stroke', () => {
    render(<TextPressure text="ab" flex={false} textColor="#123456" />);
    const heading = screen.getByRole('heading');
    expect(heading).not.toHaveClass('flex');
    expect(heading.querySelector('span')).toHaveStyle({ color: '#123456' });
  });

  it('never goes below the minimum font size', () => {
    render(<TextPressure text="abc" minFontSize={42} />);
    expect(screen.getByRole('heading')).toHaveStyle({ fontSize: '42px' });
  });

  const mockLayout = () =>
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      x: 0, y: 0, left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100, toJSON() {},
    } as DOMRect);

  it('updates font variation settings on every animation frame', () => {
    mockLayout();
    render(<TextPressure text="ab" alpha />);
    flushFrames(2);
    const span = screen.getByRole('heading').querySelector('span')!;
    expect(span.style.fontVariationSettings).toMatch(/'wght' \d+, 'wdth' \d+, 'ital' [\d.]+/);
    expect(span.style.opacity).not.toBe('');
  });

  it('uses neutral axes when width/weight/italic are disabled', () => {
    render(<TextPressure text="a" width={false} weight={false} italic={false} />);
    flushFrames(1);
    const span = screen.getByRole('heading').querySelector('span')!;
    expect(span.style.fontVariationSettings).toBe("'wght' 400, 'wdth' 100, 'ital' 0");
    expect(span.style.opacity).toBe('1');
  });

  it('tracks mouse and touch movement', () => {
    mockLayout();
    render(<TextPressure text="ab" />);
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 10, clientY: 20 }));
      const touch = new Event('touchmove') as any;
      touch.touches = [{ clientX: 5, clientY: 5 }];
      window.dispatchEvent(touch);
    });
    flushFrames(1);
    expect(screen.getByRole('heading').querySelector('span')!.style.fontVariationSettings).not.toBe('');
  });

  it('rescales vertically when scale is enabled', () => {
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue({ x: 0, y: 0, left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100, toJSON() {} } as DOMRect);
    render(<TextPressure text="ab" scale />);
    flushFrames(1);
    expect(screen.getByRole('heading').style.transform).toBe('scale(1, 1)');
    rectSpy.mockRestore();
  });

  it('removes listeners and cancels the animation loop on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<TextPressure text="ab" />);
    unmount();
    const removed = removeSpy.mock.calls.map((c) => c[0]);
    expect(removed).toEqual(expect.arrayContaining(['mousemove', 'touchmove', 'resize']));
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });
});
