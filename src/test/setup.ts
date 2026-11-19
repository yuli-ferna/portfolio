import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';

// src/i18n/utils.ts runs a top-level `await fetch(...)` against
// raw.githubusercontent.com when NODE_ENV !== 'development'. Never hit the
// network from tests: make the default fetch fail so the module falls back to
// the bundled JSON. Individual tests override this with their own mocks.
vi.stubGlobal(
  'fetch',
  vi.fn(() => Promise.reject(new Error('network disabled in tests'))),
);

if (typeof window !== 'undefined') {
  // IntersectionObserver: not implemented by happy-dom in a controllable way.
  // Each instance is recorded so tests can trigger intersections manually.
  class MockIntersectionObserver {
    static instances: MockIntersectionObserver[] = [];
    callback: IntersectionObserverCallback;
    options?: IntersectionObserverInit;
    elements = new Set<Element>();
    constructor(cb: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      this.callback = cb;
      this.options = options;
      MockIntersectionObserver.instances.push(this);
    }
    observe = (el: Element) => void this.elements.add(el);
    unobserve = (el: Element) => void this.elements.delete(el);
    disconnect = () => this.elements.clear();
    takeRecords = () => [];
    root = null;
    rootMargin = '';
    thresholds = [];
    trigger(isIntersecting: boolean) {
      const entries = [...this.elements].map(
        (target) =>
          ({ target, isIntersecting, intersectionRatio: isIntersecting ? 1 : 0 }) as IntersectionObserverEntry,
      );
      this.callback(entries, this as unknown as IntersectionObserver);
    }
  }
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  (globalThis as any).__IO__ = MockIntersectionObserver;

  if (!window.matchMedia) {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
  }

  afterEach(async () => {
    const { cleanup } = await import('@testing-library/react');
    cleanup();
    MockIntersectionObserver.instances.length = 0;
  });
}
