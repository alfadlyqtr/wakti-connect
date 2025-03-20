
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileLoader from '../ProfileLoader';

describe('ProfileLoader', () => {
  it('renders a loading spinner', () => {
    render(<ProfileLoader />);
    
    // Check if the loading spinner element exists
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    
    // Check that it has the expected styling
    expect(spinner).toHaveClass('animate-spin');
  });
});
