import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../../context/CartContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('useCart Hook', () => {
  it('initializes with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    expect(result.current.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    const product = {
      id: 1,
      name: 'Test Product',
      price: 29.99,
      image: 'test.jpg',
    };
    
    act(() => {
      result.current.addItem(product);
    });
    
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Test Product');
    expect(result.current.itemCount).toBe(1);
  });

  it('increases quantity when adding same item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    const product = {
      id: 1,
      name: 'Test Product',
      price: 29.99,
      image: 'test.jpg',
    };
    
    act(() => {
      result.current.addItem(product);
      result.current.addItem(product);
    });
    
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.itemCount).toBe(2);
  });

  it('removes item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    const product = {
      id: 1,
      name: 'Test Product',
      price: 29.99,
      image: 'test.jpg',
    };
    
    act(() => {
      result.current.addItem(product);
    });
    
    expect(result.current.items).toHaveLength(1);
    
    act(() => {
      result.current.removeItem(1);
    });
    
    expect(result.current.items).toHaveLength(0);
  });

  it('calculates total price correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    const product1 = { id: 1, name: 'Product 1', price: 10, image: 'test.jpg' };
    const product2 = { id: 2, name: 'Product 2', price: 20, image: 'test.jpg' };
    
    act(() => {
      result.current.addItem(product1);
      result.current.addItem(product2);
    });
    
    expect(result.current.total).toBe(30);
  });

  it('clears cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    const product = {
      id: 1,
      name: 'Test Product',
      price: 29.99,
      image: 'test.jpg',
    };
    
    act(() => {
      result.current.addItem(product);
    });
    
    expect(result.current.items).toHaveLength(1);
    
    act(() => {
      result.current.clearCart();
    });
    
    expect(result.current.items).toHaveLength(0);
  });
});
