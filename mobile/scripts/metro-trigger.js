#!/usr/bin/env node
// Triggers a bundle request to Metro so missing-module errors appear without needing full iOS build.
// Usage: run after `npm run metro:log` has started.
// It will poll until Metro responds, then request the iOS bundle. Any error printed by Metro
// (e.g., Unable to resolve module ...) will be captured in logs/metro-error.log via the existing tee.

const http = require('http');
const fs = require('fs');
const path = require('path');

const METRO_HOST = 'localhost';
const METRO_PORT = 8081;
const BUNDLE_PATH = '/index.bundle?platform=ios&dev=true&minify=false';
const LOG_PATH = path.join(__dirname, '..', 'logs', 'metro-trigger.log');

function log(msg, obj) {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    msg,
    ...(obj || {}),
  });
  fs.appendFileSync(LOG_PATH, line + '\n');
  process.stdout.write(line + '\n');
}

function checkReady(retries = 20) {
  return new Promise((resolve, reject) => {
    function attempt(remaining) {
      const req = http.get(
        { host: METRO_HOST, port: METRO_PORT, path: '/status' },
        res => {
          if (res.statusCode === 200) {
            log('metro_ready');
            resolve();
          } else {
            log('metro_status_non_200', { status: res.statusCode });
            retry(remaining - 1);
          }
        },
      );
      req.on('error', () => retry(remaining - 1));
    }
    function retry(remaining) {
      if (remaining <= 0) return reject(new Error('Metro not responding'));
      setTimeout(() => attempt(remaining), 500);
    }
    attempt(retries);
  });
}

function requestBundle() {
  return new Promise(resolve => {
    const start = Date.now();
    const req = http.get(
      { host: METRO_HOST, port: METRO_PORT, path: BUNDLE_PATH },
      res => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => {
          const durationMs = Date.now() - start;
          const isError = /Unable to resolve module|Cannot find module/i.test(
            data,
          );
          log('bundle_response', {
            status: res.statusCode,
            durationMs,
            bytes: data.length,
            isError,
          });
          if (isError) {
            // Extract first line containing the error for quick reference
            const firstErrLine = data
              .split(/\n/)
              .find(l =>
                /Unable to resolve module|Cannot find module/i.test(l),
              );
            log('bundle_error_extracted', { line: firstErrLine });
          }
          resolve();
        });
      },
    );
    req.on('error', err => {
      log('bundle_request_error', { error: err.message });
      resolve();
    });
  });
}

(async () => {
  log('trigger_start');
  try {
    await checkReady();
    await requestBundle();
    log('trigger_complete');
  } catch (e) {
    log('trigger_failed', { error: e.message });
  }
})();
