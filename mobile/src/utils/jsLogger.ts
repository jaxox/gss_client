/**
 * JS Logger utility: bridges JavaScript errors to native os_log and a persistent file.
 * The native module `JSLoggerModule` appends JSON lines to Caches/js-errors.log
 * and emits os_log entries under subsystem `com.gssclient.js` category `error`.
 */
import { NativeModules } from 'react-native';

const { JSLoggerModule } = NativeModules as {
  JSLoggerModule?: { logError?: (payload: string) => void };
};

export interface JsErrorPayload {
  ts: string; // ISO timestamp
  source: 'global' | 'boundary';
  isFatal?: boolean;
  name?: string;
  message?: string;
  stack?: string[];
  componentStack?: string;
  dedupeKey?: string; // hash for de-duplication
}

// Simple non-crypto hash without bitwise operators (to satisfy lint)
function hash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) % 0x7fffffff; // keep in 32-bit positive range
  }
  return h.toString(16);
}

export function logJsError(payload: Omit<JsErrorPayload, 'ts' | 'dedupeKey'>) {
  const ts = new Date().toISOString();
  const base = `${payload.source}|${payload.name}|${payload.message}|${payload.stack?.[0]}`;
  const dedupeKey = hash(base);
  const full: JsErrorPayload = { ...payload, ts, dedupeKey };
  const json = JSON.stringify(full);
  // Still mirror to console so DevTools shows it.
  // Prefix used for easy grep in Metro output if needed.
  console.error('[AUTO_JS_ERROR]', json);
  try {
    JSLoggerModule?.logError?.(json);
  } catch (e) {
    // Swallow to avoid recursive logging loops.
  }
}
