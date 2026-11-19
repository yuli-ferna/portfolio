import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Ubication from '../Ubication';

describe('Ubication', () => {
  it('renders the location text with a pin icon', () => {
    const { container } = render(<Ubication text="Caracas, Venezuela" />);
    expect(screen.getByText('Caracas, Venezuela')).toBeInTheDocument();
    expect(container.querySelector('svg title')?.textContent).toBe('map-navigation-pin-location-2');
  });
});
