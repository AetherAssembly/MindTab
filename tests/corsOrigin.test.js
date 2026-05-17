// Tests for CORS origin validation logic from server/index.js.

import { describe, it, expect } from 'vitest';

// ── Inlined from server/index.js ──────────────────────────────────────────────

function isAllowedOrigin(origin) {
  return !origin ||
    origin.startsWith('moz-extension://') ||
    origin.startsWith('chrome-extension://') ||
    /^https?:\/\/localhost(:\d+)?$/.test(origin);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('CORS origin validation', () => {
  it('allows requests with no origin (same-origin or non-browser)', () => {
    expect(isAllowedOrigin(undefined)).toBe(true);
    expect(isAllowedOrigin(null)).toBe(true);
    expect(isAllowedOrigin('')).toBe(true);
  });

  it('allows Firefox extension origins', () => {
    expect(isAllowedOrigin('moz-extension://abc123-some-uuid')).toBe(true);
    expect(isAllowedOrigin('moz-extension://00000000-0000-0000-0000-000000000000')).toBe(true);
  });

  it('allows Chrome/Edge extension origins', () => {
    expect(isAllowedOrigin('chrome-extension://abcdefghijklmn')).toBe(true);
    expect(isAllowedOrigin('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn')).toBe(true);
  });

  it('allows localhost with and without port', () => {
    expect(isAllowedOrigin('http://localhost')).toBe(true);
    expect(isAllowedOrigin('http://localhost:3000')).toBe(true);
    expect(isAllowedOrigin('https://localhost')).toBe(true);
    expect(isAllowedOrigin('https://localhost:8080')).toBe(true);
  });

  it('blocks arbitrary web origins', () => {
    expect(isAllowedOrigin('https://example.com')).toBe(false);
    expect(isAllowedOrigin('https://evil.com')).toBe(false);
    expect(isAllowedOrigin('http://mysite.org')).toBe(false);
  });

  it('blocks spoofed origins that start with allowed prefixes in the path', () => {
    expect(isAllowedOrigin('https://moz-extension.evil.com')).toBe(false);
    expect(isAllowedOrigin('https://chrome-extension.evil.com')).toBe(false);
  });

  it('blocks localhost-lookalike domains', () => {
    expect(isAllowedOrigin('https://localhost.evil.com')).toBe(false);
    expect(isAllowedOrigin('http://localhostproxy.com')).toBe(false);
  });

  it('blocks null-origin string (distinct from null/undefined)', () => {
    // The string "null" can appear in sandboxed iframes — must be blocked
    expect(isAllowedOrigin('null')).toBe(false);
  });
});
