import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ShinyText from '../ShinyText';

describe('ShinyText', () => {
  it('renders the text with the shine animation by default', () => {
    render(<ShinyText text="Shiny" />);
    const el = screen.getByText('Shiny');
    expect(el).toHaveClass('animate-shine');
    expect(el.style.animationDuration).toBe('5s');
  });

  it('uses a custom speed and className', () => {
    render(<ShinyText text="Fast" speed={2} className="big" />);
    const el = screen.getByText('Fast');
    expect(el.style.animationDuration).toBe('2s');
    expect(el).toHaveClass('big');
  });

  it('does not animate when disabled', () => {
    render(<ShinyText text="Still" disabled />);
    expect(screen.getByText('Still')).not.toHaveClass('animate-shine');
  });
});
