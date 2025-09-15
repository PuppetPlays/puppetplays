// Import essential testing libraries
import '@testing-library/jest-dom';

// Set test environment
global.process.env.NODE_ENV = 'test';

// Mock canvas and related modules before any imports
jest.mock('canvas', () => require('./__mocks__/canvas.js'));

// Mock pdfjs-dist to prevent canvas loading issues
jest.mock('pdfjs-dist', () => ({
  getDocument: jest.fn(() =>
    Promise.resolve({
      promise: Promise.resolve({
        numPages: 1,
        getPage: jest.fn(() =>
          Promise.resolve({
            getViewport: jest.fn(() => ({ width: 100, height: 100 })),
            render: jest.fn(() => ({ promise: Promise.resolve() })),
          }),
        ),
      }),
    }),
  ),
  GlobalWorkerOptions: {
    workerSrc: '',
  },
}));

// Mock html2canvas
jest.mock('html2canvas', () =>
  jest.fn(() =>
    Promise.resolve({
      toDataURL: jest.fn(() => 'data:image/png;base64,'),
    }),
  ),
);

// Suppress console warnings during tests
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('canvas') || args[0].includes('Canvas'))
  ) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};
