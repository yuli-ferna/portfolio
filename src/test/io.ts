import { act } from '@testing-library/react';

type IOInstance = {
  elements: Set<Element>;
  options?: IntersectionObserverInit;
  trigger: (isIntersecting: boolean) => void;
};

/** All IntersectionObserver instances created since the last test cleanup. */
export const observers = (): IOInstance[] => (globalThis as any).__IO__.instances;

/** Fire an intersection change on every live observer, wrapped in act(). */
export function intersectAll(isIntersecting = true) {
  act(() => {
    observers().forEach((o) => o.trigger(isIntersecting));
  });
}
