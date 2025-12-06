import { useEffect } from 'react';

interface KeyboardNavigationOptions {
  onEscape?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onEnter?: () => void;
  enabled?: boolean;
}

export const useKeyboardNavigation = (options: KeyboardNavigationOptions) => {
  const {
    onEscape,
    onArrowLeft,
    onArrowRight,
    onArrowUp,
    onArrowDown,
    onEnter,
    enabled = true,
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onEscape?.();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onArrowLeft?.();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onArrowRight?.();
          break;
        case 'ArrowUp':
          e.preventDefault();
          onArrowUp?.();
          break;
        case 'ArrowDown':
          e.preventDefault();
          onArrowDown?.();
          break;
        case 'Enter':
          onEnter?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onEscape, onArrowLeft, onArrowRight, onArrowUp, onArrowDown, onEnter]);
};
