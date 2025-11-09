#!/usr/bin/env node
// Simple watcher that summarizes new Metro errors from logs/metro-error.log
// Run after starting `npm run metro:log`. It will print a JSON summary whenever
// new error lines appear. This gives autonomous visibility even if interactive
// build output can't be streamed fully in the assistant environment.

const fs = require('fs');
const path = require('path');

const LOG_PATH = path.join(__dirname, '..', 'logs', 'metro-error.log');
let lastSize = 0;
const seen = new Set();

function scan() {
  if (!fs.existsSync(LOG_PATH)) {
    process.stdout.write(
      JSON.stringify({
        status: 'waiting',
        message: 'log file not found yet',
        path: LOG_PATH,
      }) + '\n',
    );
    return;
  }
  const stat = fs.statSync(LOG_PATH);
  if (stat.size === lastSize) return; // no growth
  lastSize = stat.size;
  const content = fs.readFileSync(LOG_PATH, 'utf8');
  const lines = content.split(/\r?\n/).filter(Boolean);
  const errorLines = lines.filter(l =>
    /Unable to resolve module|ERROR\s+Error:/.test(l),
  );
  let newErrors = [];
  for (const line of errorLines) {
    if (!seen.has(line)) {
      seen.add(line);
      newErrors.push(line);
    }
  }
  if (newErrors.length) {
    process.stdout.write(
      JSON.stringify({
        ts: new Date().toISOString(),
        newCount: newErrors.length,
        newErrors,
        totalUnique: seen.size,
      }) + '\n',
    );
  }
}

setInterval(scan, 1500);
scan();
