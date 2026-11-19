import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PixelCVFolder from '../PixelCVFolder';

const CV = 'https://drive.google.com/file/d/abc/view';
const preventNavigation = (e: Event) => e.preventDefault();

describe('PixelCVFolder', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.addEventListener('click', preventNavigation);
  });
  afterEach(() => {
    vi.useRealTimers();
    document.removeEventListener('click', preventNavigation);
  });

  it('renders an accessible external link to the CV with the default label', () => {
    render(<PixelCVFolder cvLink={CV} />);
    const link = screen.getByRole('link', { name: 'View my CV' });
    expect(link).toHaveAttribute('href', CV);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveTextContent('View my CV↗');
  });

  it('uses a custom label', () => {
    render(<PixelCVFolder cvLink={CV} label="Ver mi CV" />);
    expect(screen.getByRole('link', { name: 'Ver mi CV' })).toBeInTheDocument();
  });

  it('opens the folder on hover and closes it shortly after leaving', () => {
    render(<PixelCVFolder cvLink={CV} />);
    const link = screen.getByRole('link');
    expect(link).not.toHaveClass('is-open');

    fireEvent.mouseEnter(link);
    expect(link).toHaveClass('is-open');

    fireEvent.mouseLeave(link);
    expect(link).toHaveClass('is-open'); // grace period
    act(() => void vi.advanceTimersByTime(150));
    expect(link).not.toHaveClass('is-open');
  });

  it('cancels the pending close when the pointer comes back', () => {
    render(<PixelCVFolder cvLink={CV} />);
    const link = screen.getByRole('link');
    fireEvent.mouseEnter(link);
    fireEvent.mouseLeave(link);
    act(() => void vi.advanceTimersByTime(100));
    fireEvent.mouseEnter(link);
    act(() => void vi.advanceTimersByTime(200));
    expect(link).toHaveClass('is-open');
  });

  it('animates the scan line while open without errors', () => {
    render(<PixelCVFolder cvLink={CV} />);
    const link = screen.getByRole('link');
    fireEvent.mouseEnter(link);
    act(() => void vi.advanceTimersByTime(55 * 40)); // goes up and back down
    expect(link).toHaveClass('is-open');
  });

  it('shows a decorative spark burst on click that disappears after 300ms', () => {
    const { container } = render(<PixelCVFolder cvLink={CV} />);
    const link = screen.getByRole('link');

    fireEvent.click(link);
    expect(link).toHaveClass('is-clicked');
    const sparks = container.querySelector('.pcf-sparks')!;
    expect(sparks).toHaveAttribute('aria-hidden', 'true');
    expect(sparks.children).toHaveLength(5);

    act(() => void vi.advanceTimersByTime(300));
    expect(link).not.toHaveClass('is-clicked');
    expect(container.querySelector('.pcf-sparks')).toBeNull();
  });

  it('renders both the closed and the open folder artwork', () => {
    const { container } = render(<PixelCVFolder cvLink={CV} />);
    expect(container.querySelector('.pcf-closed svg')).not.toBeNull();
    expect(container.querySelector('.pcf-opened svg')).not.toBeNull();
  });
});
