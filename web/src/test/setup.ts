/**
 * Test setup for GSS Web React application
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Extend global interface for mocking
declare global {
  interface Global {
    fetch: typeof vi.fn;
  }
}

// Mock fetch globally
Object.assign(globalThis, {
  fetch: vi.fn(),
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
Object.assign(globalThis, {
  ResizeObserver: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});

// Mock IntersectionObserver
Object.assign(globalThis, {
  IntersectionObserver: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});
