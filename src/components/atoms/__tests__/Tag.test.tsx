import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Tag from '../Tag';

describe('Tag', () => {
  it('renders the text', () => {
    render(<Tag text="TypeScript" />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('appends a custom className and disables translation', () => {
    render(<Tag text="React" className="custom-class" />);
    const wrapper = screen.getByText('React').parentElement!;
    expect(wrapper).toHaveClass('custom-class');
    expect(wrapper).toHaveAttribute('translate', 'no');
  });
});
