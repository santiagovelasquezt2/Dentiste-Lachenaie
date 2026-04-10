import { RefObject, useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

type UseFocusTrapOptions = {
  active: boolean;
  containerRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  onEscape?: () => void;
};

function focusElement(element: HTMLElement | null | undefined) {
  if (!element) return;
  element.focus({ preventScroll: true });
}

export function useFocusTrap({
  active,
  containerRef,
  initialFocusRef,
  onEscape,
}: UseFocusTrapOptions) {
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    previousActiveElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const container = containerRef.current;
    if (!container) return;

    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    ).filter((element) => !element.hasAttribute('disabled') && element.tabIndex !== -1);

    const initialTarget = initialFocusRef?.current ?? focusables[0] ?? container;
    const rafId = window.requestAnimationFrame(() => focusElement(initialTarget));

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const orderedFocusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((element) => !element.hasAttribute('disabled') && element.tabIndex !== -1);

      if (orderedFocusables.length === 0) {
        event.preventDefault();
        focusElement(container);
        return;
      }

      const firstElement = orderedFocusables[0];
      const lastElement = orderedFocusables[orderedFocusables.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (activeElement === firstElement || !container.contains(activeElement)) {
          event.preventDefault();
          focusElement(lastElement);
        }
        return;
      }

      if (activeElement === lastElement || !container.contains(activeElement)) {
        event.preventDefault();
        focusElement(firstElement);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(rafId);
      document.removeEventListener('keydown', handleKeyDown);

      const previousElement = previousActiveElementRef.current;
      if (previousElement && document.contains(previousElement)) {
        window.requestAnimationFrame(() => focusElement(previousElement));
      }
    };
  }, [active, containerRef, initialFocusRef, onEscape]);
}
