import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import BookingWidget from '../../components/BookingWidget';

describe('BookingWidget Component', () => {
  it('renders booking button', () => {
    render(<BookingWidget />);
    expect(screen.getByText(/book now/i)).toBeInTheDocument();
  });

  it('opens booking form when button is clicked', async () => {
    render(<BookingWidget />);
    
    const button = screen.getByText(/book now/i);
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/book a session/i)).toBeInTheDocument();
    });
  });

  it('closes booking form when close button is clicked', async () => {
    render(<BookingWidget />);
    
    // Open form
    const openButton = screen.getByText(/book now/i);
    fireEvent.click(openButton);
    
    await waitFor(() => {
      expect(screen.getByText(/book a session/i)).toBeInTheDocument();
    });
    
    // Close form
    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText(/book a session/i)).not.toBeInTheDocument();
    });
  });
});
