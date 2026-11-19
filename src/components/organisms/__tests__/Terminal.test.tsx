import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Terminal, { type TerminalProps } from '../Terminal';

const props: TerminalProps = {
  commands: {
    help: { text: 'commands: whoami · clear' },
    whoami: { text: 'Yuliana — Software Developer' },
    projects: { text: 'opening projects.exe …', links: [{ text: 'site', href: 'https://example.dev/' }] },
    'sudo hire-me': { text: 'permission granted', kind: 'gold' },
  },
  quick: ['help', 'whoami', 'projects'],
  welcome: 'Welcome!',
  notFound: 'command not found: {cmd}',
  placeholder: 'type help',
  inputLabel: 'Terminal command',
};

function setup() {
  const user = userEvent.setup();
  render(<Terminal {...props} />);
  const input = screen.getByRole('textbox', { name: 'Terminal command' }) as HTMLInputElement;
  const log = screen.getByRole('log');
  return { user, input, log };
}

describe('Terminal', () => {
  it('shows the welcome line and one button per quick command plus clear', () => {
    const { log } = setup();
    expect(log).toHaveTextContent('Welcome!');
    const buttons = screen.getAllByRole('button').map((b) => b.textContent);
    expect(buttons).toEqual(['help', 'whoami', 'projects', 'clear']);
  });

  it('runs a typed command on Enter, echoing it and clearing the input', async () => {
    const { user, input, log } = setup();
    await user.type(input, 'whoami{Enter}');
    expect(log).toHaveTextContent('$ whoami');
    expect(log).toHaveTextContent('Yuliana — Software Developer');
    expect(input.value).toBe('');
  });

  it('normalises case and spacing, so multi-word commands work', async () => {
    const { user, input, log } = setup();
    await user.type(input, '  SUDO   hire-me {Enter}');
    expect(log).toHaveTextContent('permission granted');
  });

  it('reports unknown commands', async () => {
    const { user, input, log } = setup();
    await user.type(input, 'rm -rf{Enter}');
    expect(log).toHaveTextContent('command not found: rm -rf');
  });

  it('runs quick commands and renders their links', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'projects' }));
    const link = screen.getByRole('link', { name: /site/ });
    expect(link).toHaveAttribute('href', 'https://example.dev/');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('clears the log', async () => {
    const { user, log } = setup();
    await user.click(screen.getByRole('button', { name: 'help' }));
    await user.click(screen.getByRole('button', { name: 'clear' }));
    expect(log).not.toHaveTextContent('Welcome!');
    expect(log).not.toHaveTextContent('commands:');
  });

  it('recalls previous commands with the arrow keys', async () => {
    const { user, input } = setup();
    await user.type(input, 'help{Enter}');
    await user.type(input, 'whoami{Enter}');
    await user.keyboard('{ArrowUp}');
    expect(input.value).toBe('whoami');
    await user.keyboard('{ArrowUp}');
    expect(input.value).toBe('help');
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(input.value).toBe('');
  });

  it('ignores empty input', async () => {
    const { user, input, log } = setup();
    await user.type(input, '   {Enter}');
    expect(log.querySelectorAll('.terminal-line')).toHaveLength(1); // just the welcome line
  });
});
