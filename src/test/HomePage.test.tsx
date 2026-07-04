import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import HomePage from '../components/HomePage';

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

describe('HomePage Component', () => {
  it('renders the main heading and search input', () => {
    render(<HomePage onSearch={vi.fn()} loading={false} error={null} />);
    
    expect(screen.getByText('Bharat Darshan')).toBeInTheDocument();
    expect(screen.getByText('Discover the Soul of')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search any Indian city/i)).toBeInTheDocument();
  });

  it('calls onSearch with trimmed query when submitted', async () => {
    const handleSearch = vi.fn();
    const user = userEvent.setup();
    render(<HomePage onSearch={handleSearch} loading={false} error={null} />);
    
    const input = screen.getByPlaceholderText(/Search any Indian city/i);
    await user.type(input, ' Jaipur ');
    
    const submitButton = screen.getByRole('button', { name: /Search for destination/i });
    await user.click(submitButton);
    
    expect(handleSearch).toHaveBeenCalledWith('Jaipur');
    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  it('does not call onSearch when input is empty', async () => {
    const handleSearch = vi.fn();
    const user = userEvent.setup();
    render(<HomePage onSearch={handleSearch} loading={false} error={null} />);
    
    // Using test ID or a more reliable query is better since disabled buttons might not be clickable
    // but the test clicks it anyway. Actually, if it's disabled, the user.click will throw or do nothing.
    const submitButton = screen.getByRole('button', { name: /Search for destination/i });
    await user.click(submitButton);
    
    expect(handleSearch).not.toHaveBeenCalled();
  });

  it('does not call onSearch when loading is true', async () => {
    const handleSearch = vi.fn();
    const user = userEvent.setup();
    render(<HomePage onSearch={handleSearch} loading={true} error={null} />);
    
    const input = screen.getByPlaceholderText(/Search any Indian city/i);
    await user.type(input, 'Jaipur');
    
    const submitButton = screen.getByRole('button', { name: /Searching.../i });
    await user.click(submitButton);
    
    expect(handleSearch).not.toHaveBeenCalled();
  });

  it('displays an error message if error prop is provided', () => {
    render(<HomePage onSearch={vi.fn()} loading={false} error="Failed to fetch data." />);
    
    expect(screen.getByText('Failed to fetch data.')).toBeInTheDocument();
  });
});
