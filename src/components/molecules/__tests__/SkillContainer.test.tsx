import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SkillContainer from '../SkillContainer';

describe('SkillContainer', () => {
  it('renders the title and every skill', () => {
    render(<SkillContainer title="Frontend" skills={['React', 'Astro', 'CSS']} />);
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(3);
    ['React', 'Astro', 'CSS'].forEach((s) => expect(screen.getByText(s)).toBeInTheDocument());
  });

  it('applies the position class used for absolute layout', () => {
    const { container } = render(
      <SkillContainer title="Backend" skills={[]} position="min-[1320px]:top-60" />,
    );
    const card = container.querySelector('.skill-item')!;
    expect(card).toHaveClass('min-[1320px]:top-60');
  });

  it('passes the soft flag down so soft skills use the checkbox icon', () => {
    render(<SkillContainer title="Soft" skills={['Teamwork', 'React']} soft />);
    screen.getAllByRole('img').forEach((img) => expect(img).toHaveAttribute('src', '/checkbox.svg'));
  });

  it('renders duplicate skills without key collisions', () => {
    render(<SkillContainer title="Dup" skills={['Git', 'Git']} />);
    expect(screen.getAllByText('Git')).toHaveLength(2);
  });
});
