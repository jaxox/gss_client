/**
 * Unit tests for Input Sanitization Utilities
 */

import {
  sanitizeHtml,
  sanitizeEmail,
  sanitizeText,
  encodeHtmlEntities,
  validateInput,
  sanitizeUrl,
  sanitizeFilename,
} from '../utils/inputSanitization';

describe('Input Sanitization Utilities', () => {
  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const input = '<p>Hello</p><script>alert("XSS")</script>';
      const result = sanitizeHtml(input);

      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
      expect(result).toContain('Hello');
    });

    it('should remove onclick handlers', () => {
      const input = '<a href="#" onclick="alert(\'XSS\')">Click</a>';
      const result = sanitizeHtml(input);

      expect(result).not.toContain('onclick');
      expect(result).toContain('Click');
    });

    it('should allow safe tags (or strip all in Node.js)', () => {
      const input = '<p>Hello <strong>World</strong></p>';
      const result = sanitizeHtml(input);

      // In browser with DOMPurify, safe tags are allowed
      // In Node.js environment, all tags are stripped
      expect(result).toContain('Hello');
      expect(result).toContain('World');
    });

    it('should handle empty string', () => {
      expect(sanitizeHtml('')).toBe('');
    });
  });

  describe('sanitizeEmail', () => {
    it('should normalize valid email', () => {
      const input = '  Test.User@Example.COM  ';
      const result = sanitizeEmail(input);

      expect(result).toBe('test.user@example.com');
    });

    it('should return empty string for invalid email', () => {
      const input = 'not-an-email';
      const result = sanitizeEmail(input);

      expect(result).toBe('');
    });

    it('should handle empty string', () => {
      expect(sanitizeEmail('')).toBe('');
    });
  });

  describe('sanitizeText', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("XSS")</script>';
      const result = sanitizeText(input);

      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
      expect(result).not.toContain('<script>');
    });

    it('should trim whitespace', () => {
      const input = '   Hello World   ';
      const result = sanitizeText(input);

      expect(result.startsWith(' ')).toBe(false);
      expect(result.endsWith(' ')).toBe(false);
    });
  });

  describe('encodeHtmlEntities', () => {
    it('should encode special characters', () => {
      const input = '<div>Test & "quotes" \'apostrophe\'</div>';
      const result = encodeHtmlEntities(input);

      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
      expect(result).toContain('&amp;');
      expect(result).toContain('&quot;');
      expect(result).toContain('&#39;');
    });

    it('should handle empty string', () => {
      expect(encodeHtmlEntities('')).toBe('');
    });
  });

  describe('validateInput', () => {
    it('should validate required fields', () => {
      const result = validateInput('', { required: true });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('This field is required');
    });

    it('should validate min length', () => {
      const result = validateInput('abc', { minLength: 5 });

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('at least 5 characters');
    });

    it('should validate max length', () => {
      const result = validateInput('abcdefghij', { maxLength: 5 });

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('no more than 5 characters');
    });

    it('should validate email format', () => {
      const result = validateInput('not-an-email', { email: true });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid email address');
    });

    it('should validate URL format', () => {
      const result = validateInput('not a url', { url: true });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid URL');
    });

    it('should validate pattern', () => {
      const result = validateInput('abc123', { pattern: /^[0-9]+$/ });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid format');
    });

    it('should pass valid input', () => {
      const result = validateInput('test@example.com', {
        required: true,
        email: true,
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should allow empty non-required fields', () => {
      const result = validateInput('', { minLength: 5 });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('sanitizeUrl', () => {
    it('should block javascript: URLs', () => {
      const input = 'javascript:alert("XSS")';
      const result = sanitizeUrl(input);

      expect(result).toBe('');
    });

    it('should block data: URLs', () => {
      const input = 'data:text/html,<script>alert("XSS")</script>';
      const result = sanitizeUrl(input);

      expect(result).toBe('');
    });

    it('should allow valid HTTP URLs', () => {
      const input = 'http://example.com';
      const result = sanitizeUrl(input);

      expect(result).toBe('http://example.com');
    });

    it('should allow valid HTTPS URLs', () => {
      const input = 'https://example.com/path?query=value';
      const result = sanitizeUrl(input);

      expect(result).toBe('https://example.com/path?query=value');
    });

    it('should handle empty string', () => {
      expect(sanitizeUrl('')).toBe('');
    });
  });

  describe('sanitizeFilename', () => {
    it('should remove path separators', () => {
      const input = '../../../etc/passwd';
      const result = sanitizeFilename(input);

      expect(result).not.toContain('/');
      expect(result).not.toContain('..');
    });

    it('should remove special characters', () => {
      const input = 'file<name>.txt';
      const result = sanitizeFilename(input);

      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });

    it('should limit length to 255 characters', () => {
      const input = 'a'.repeat(300);
      const result = sanitizeFilename(input);

      expect(result.length).toBeLessThanOrEqual(255);
    });

    it('should allow safe filenames', () => {
      const input = 'my-document_v2.pdf';
      const result = sanitizeFilename(input);

      expect(result).toBe('my-document_v2.pdf');
    });
  });
});
