import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../utils/test-utils';
import Cart from '../../components/Cart';

describe('Cart Component', () => {
  it('renders empty cart message when cart is empty', () => {
    render(<Cart isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<Cart isOpen={true} onClose={onClose} />);
    
    const closeButton = screen.getByLabelText(/close cart/i);
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(<Cart isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});
