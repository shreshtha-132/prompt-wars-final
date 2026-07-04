import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import LoadingOverlay from '../components/LoadingOverlay';

// Mock matchMedia for motion/react
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('LoadingOverlay Component', () => {
  it('does not render when isVisible is false', () => {
    const { container } = render(<LoadingOverlay isVisible={false} destinationName={null} />);
    // When isVisible is false, AnimatePresence removes the div
    expect(container.firstChild).toBeNull();
  });

  it('renders loading overlay when isVisible is true', () => {
    render(<LoadingOverlay isVisible={true} destinationName="Varanasi" />);
    
    // Check if the destination name is rendered
    expect(screen.getByText(/Curating Varanasi\.\.\./i)).toBeInTheDocument();
    
    // Check if the Hindi text is present
    expect(screen.getByText('कृपया प्रतीक्षा करें (Please wait)')).toBeInTheDocument();
    
    // Check if 'Did you know?' is present
    expect(screen.getByText('Did you know?')).toBeInTheDocument();
  });

  it('renders default text when destinationName is null', () => {
    render(<LoadingOverlay isVisible={true} destinationName={null} />);
    
    // Check if default text is used
    expect(screen.getByText(/Discovering Bharat\.\.\./i)).toBeInTheDocument();
  });
});
