import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Description from '../Description';

const words = (n: number) => Array.from({ length: n }, (_, i) => `w${i + 1}`).join(' ');

describe('Description', () => {
  it('renders short text in full without a toggle', () => {
    render(<Description text="A short description" />);
    expect(screen.getByText(/A short description/)).toBeInTheDocument();
    expect(screen.queryByText(/Show more/)).not.toBeInTheDocument();
  });

  it('does not truncate when the word count equals the limit', () => {
    render(<Description text={words(5)} amountOfWords={5} />);
    expect(screen.queryByText(/Show more/)).not.toBeInTheDocument();
    expect(screen.getByText(/w1 w2 w3 w4 w5/)).toBeInTheDocument();
  });

  it('truncates long text and hides the remainder', () => {
    const { container } = render(<Description text={words(10)} amountOfWords={5} />);
    const paragraph = container.querySelector('p')!;
    // First (limit - 1) words are visible.
    expect(paragraph.textContent).toMatch(/^w1 w2 w3 w4/);
    expect(screen.getByText('...', { exact: false })).toBeInTheDocument();
    const rest = screen.getByText('w5 w6 w7 w8 w9 w10');
    expect(rest).toHaveClass('hidden');
    expect(screen.getByText(/Show more/)).toBeInTheDocument();
  });

  it('expands and collapses when the toggle is clicked', async () => {
    const user = userEvent.setup();
    render(<Description text={words(10)} amountOfWords={5} />);

    await user.click(screen.getByText(/Show more/));
    expect(screen.getByText('w5 w6 w7 w8 w9 w10')).not.toHaveClass('hidden');
    expect(screen.queryByText('...', { exact: false })).not.toBeInTheDocument();
    expect(screen.getByText(/Show less/)).toBeInTheDocument();

    await user.click(screen.getByText(/Show less/));
    expect(screen.getByText('w5 w6 w7 w8 w9 w10')).toHaveClass('hidden');
    expect(screen.getByText(/Show more/)).toBeInTheDocument();
  });

  it('uses 40 words as the default limit', () => {
    const { rerender } = render(<Description text={words(40)} />);
    expect(screen.queryByText(/Show more/)).not.toBeInTheDocument();
    rerender(<Description text={words(41)} />);
    expect(screen.getByText(/Show more/)).toBeInTheDocument();
  });
});
