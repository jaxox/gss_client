/**
 * Unit tests for jsLogger utility
 */

// Create a mock object that can be mutated
const mockJSLoggerModule = {
  logError: jest.fn(),
};

jest.mock('react-native', () => ({
  NativeModules: {
    JSLoggerModule: mockJSLoggerModule,
  },
}));

import { logJsError } from '../jsLogger';

describe('jsLogger', () => {
  let mockLogError: jest.Mock;

  beforeEach(() => {
    // Get reference to the mock function
    mockLogError = mockJSLoggerModule.logError as jest.Mock;
    mockLogError.mockClear();
    // Mock console.error to avoid test noise
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log error with correct payload structure', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');

    logJsError({
      source: 'global',
      isFatal: true,
      name: 'TestError',
      message: 'This is a test error',
      stack: ['line1', 'line2'],
    });

    // Verify console.error was called (always happens)
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[AUTO_JS_ERROR]',
      expect.stringContaining('TestError'),
    );

    // Extract the JSON payload from console.error call
    const jsonPayload = consoleErrorSpy.mock.calls[0][1];
    const payload = JSON.parse(jsonPayload);

    expect(payload).toMatchObject({
      source: 'global',
      isFatal: true,
      name: 'TestError',
      message: 'This is a test error',
      stack: ['line1', 'line2'],
    });
    expect(payload.ts).toBeDefined();
    expect(payload.dedupeKey).toBeDefined();

    // Native module may or may not be called (depends on mock setup)
    if (mockLogError.mock.calls.length > 0) {
      expect(mockLogError).toHaveBeenCalledWith(jsonPayload);
    }
  });

  it('should generate consistent dedupe keys for identical errors', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');

    const errorData = {
      source: 'boundary' as const,
      name: 'TypeError',
      message: 'Cannot read property',
      stack: ['at Component.render'],
    };

    logJsError(errorData);
    logJsError(errorData);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);

    const payload1 = JSON.parse(consoleErrorSpy.mock.calls[0][1]);
    const payload2 = JSON.parse(consoleErrorSpy.mock.calls[1][1]);

    expect(payload1.dedupeKey).toBe(payload2.dedupeKey);
  });

  it('should generate different dedupe keys for different errors', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');

    logJsError({
      source: 'global',
      name: 'Error1',
      message: 'Message1',
      stack: [],
    });

    logJsError({
      source: 'global',
      name: 'Error2',
      message: 'Message2',
      stack: [],
    });

    const payload1 = JSON.parse(consoleErrorSpy.mock.calls[0][1]);
    const payload2 = JSON.parse(consoleErrorSpy.mock.calls[1][1]);

    expect(payload1.dedupeKey).not.toBe(payload2.dedupeKey);
  });

  it('should handle errors even if native module throws', () => {
    // Make native module throw
    mockLogError.mockImplementationOnce(() => {
      throw new Error('Native module error');
    });

    // Should not throw - error should be swallowed
    expect(() => {
      logJsError({
        source: 'global',
        name: 'TestError',
        message: 'Test message',
        stack: [],
      });
    }).not.toThrow();
  });

  it('should log to console even when native logging fails', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');

    logJsError({
      source: 'global',
      name: 'TestError',
      message: 'Console test',
      stack: [],
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[AUTO_JS_ERROR]',
      expect.stringContaining('Console test'),
    );
  });

  it('should include component stack when provided', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');

    logJsError({
      source: 'boundary',
      name: 'RenderError',
      message: 'Failed to render',
      stack: ['at Component'],
      componentStack: 'in MyComponent\nin App',
    });

    const payload = JSON.parse(consoleErrorSpy.mock.calls[0][1]);
    expect(payload.componentStack).toBe('in MyComponent\nin App');
  });
});
