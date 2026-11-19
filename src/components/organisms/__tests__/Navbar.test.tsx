import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Navbar from '../Navbar';

const SECTIONS = ['home', 'skills', 'experience', 'projects', 'education', 'contact'];

describe('Navbar (React)', () => {
  let scrollTo: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    scrollTo = vi.fn();
    vi.stubGlobal('scrollTo', scrollTo);
    window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
  });

  it('renders one button per section with an icon', () => {
    render(<Navbar lang="en" />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(SECTIONS.length);
    buttons.forEach((b, i) => {
      expect(b).toHaveAccessibleName(SECTIONS[i]);
      expect(b.querySelector('svg')).not.toBeNull();
    });
  });

  it('uses translated tooltips (English)', () => {
    render(<Navbar lang="en" />);
    expect(screen.getByRole('button', { name: 'skills' })).toHaveAttribute('title', 'Skills');
    expect(screen.getByRole('button', { name: 'contact' })).toHaveAttribute('title', 'Contact');
  });

  it('uses translated tooltips (Spanish)', () => {
    render(<Navbar lang="es" />);
    expect(screen.getByRole('button', { name: 'home' })).toHaveAttribute('title', 'Inicio');
    expect(screen.getByRole('button', { name: 'education' })).toHaveAttribute('title', 'Educación');
  });

  it('marks the first item as active initially', () => {
    render(<Navbar lang="en" />);
    expect(screen.getByRole('button', { name: 'home' })).toHaveClass('active');
    expect(screen.getByRole('button', { name: 'skills' })).not.toHaveClass('active');
  });

  it('activates the clicked item and scrolls to its section', async () => {
    const user = userEvent.setup();
    const section = document.createElement('section');
    section.id = 'experience';
    Object.defineProperty(section, 'offsetTop', { value: 1234 });
    document.body.appendChild(section);

    render(<Navbar lang="en" />);
    await user.click(screen.getByRole('button', { name: 'experience' }));

    expect(screen.getByRole('button', { name: 'experience' })).toHaveClass('active');
    expect(screen.getByRole('button', { name: 'home' })).not.toHaveClass('active');
    expect(scrollTo).toHaveBeenCalledWith({ top: 1234 });
    section.remove();
  });

  it('scrolls to the top when the section does not exist', async () => {
    const user = userEvent.setup();
    render(<Navbar lang="en" />);
    await user.click(screen.getByRole('button', { name: 'projects' }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
  });
});
