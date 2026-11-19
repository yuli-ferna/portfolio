import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Certificate from '../icons/Certificate';
import Education from '../icons/Education';
import EducationAndCertificate from '../icons/EducationAndCertificate';
import Experience from '../icons/Experience';
import Github from '../icons/Github';
import Gmail from '../icons/Gmail';
import Home from '../icons/Home';
import Link from '../icons/Link';
import Linkedin from '../icons/Linkedin';
import Logo from '../icons/Logo';
import LogoCV from '../icons/LogoCV';
import Projects from '../icons/Projects';
import Send from '../icons/Send';
import Skill from '../icons/Skill';
import Work from '../icons/Work';

const icons = {
  Certificate,
  Education,
  EducationAndCertificate,
  Experience,
  Github,
  Gmail,
  Home,
  Link,
  Linkedin,
  Logo,
  LogoCV,
  Projects,
  Send,
  Skill,
  Work,
} as const;

describe('icon components', () => {
  it.each(Object.entries(icons))('%s renders an svg with a viewBox and drawing', (_name, Icon) => {
    const { container } = render(<Icon />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('viewBox');
    expect(container.querySelectorAll('path, rect, circle').length).toBeGreaterThan(0);
  });

  it('Logo uses its default size', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('id', 'logo');
    expect(svg).toHaveAttribute('width', '48');
    expect(svg).toHaveAttribute('height', '46');
  });

  it('Logo accepts a custom size', () => {
    const { container } = render(<Logo width={96} height={92} />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '96');
    expect(svg).toHaveAttribute('height', '92');
  });
});
