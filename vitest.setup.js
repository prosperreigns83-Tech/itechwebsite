import '@testing-library/jest-dom';

// jsdom global setup if needed
globalThis.ResizeObserver = class {
  observe() {}
  disconnect() {}
  unobserve() {}
};
