import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SkillElem from '../SkillElem';

describe('SkillElem', () => {
  it('shows the skill name and its icon from the assets manifest', () => {
    render(<SkillElem skill="React" soft={false} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    const img = screen.getByRole('img', { name: 'React' });
    expect(img).toHaveAttribute('src', '/react.svg');
  });

  it('normalises multi-word skill names', () => {
    render(<SkillElem skill="Material UI" soft={false} />);
    expect(screen.getByRole('img', { name: 'Material UI' })).toHaveAttribute('src', '/material-ui.svg');
  });

  it('uses the checkbox icon for soft skills', () => {
    render(<SkillElem skill="Teamwork" soft />);
    expect(screen.getByRole('img', { name: 'Teamwork' })).toHaveAttribute('src', '/checkbox.svg');
  });

  it('uses the checkbox icon for unknown skills', () => {
    render(<SkillElem skill="Cobol" soft={false} />);
    expect(screen.getByRole('img', { name: 'Cobol' })).toHaveAttribute('src', '/checkbox.svg');
  });

  it('falls back to the checkbox icon when the image fails to load', () => {
    render(<SkillElem skill="React" soft={false} />);
    const img = screen.getByRole('img', { name: 'React' }) as HTMLImageElement;
    fireEvent.error(img);
    expect(img.getAttribute('src')).toBe('/checkbox.svg');
    // A second failure must not loop / change the src again.
    fireEvent.error(img);
    expect(img.getAttribute('src')).toBe('/checkbox.svg');
  });
});
