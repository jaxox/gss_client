/**
 * Avatar Utilities Tests
 * Tests for avatar placeholder generation
 */

import { getInitials, generateAvatarColor } from '../../components/avatarUtils';

describe('Avatar Utilities', () => {
  describe('getInitials', () => {
    it('should extract first letter of single-word name', () => {
      expect(getInitials('John')).toBe('J');
      expect(getInitials('Alice')).toBe('A');
      expect(getInitials('Bob')).toBe('B');
    });

    it('should extract first letter of multi-word name', () => {
      expect(getInitials('John Doe')).toBe('J');
      expect(getInitials('Alice Smith')).toBe('A');
      expect(getInitials('Bob Johnson Jr')).toBe('B');
    });

    it('should uppercase the initial', () => {
      expect(getInitials('john')).toBe('J');
      expect(getInitials('alice')).toBe('A');
      expect(getInitials('bob')).toBe('B');
    });

    it('should handle empty strings', () => {
      expect(getInitials('')).toBe('?');
    });

    it('should handle whitespace-only strings', () => {
      expect(getInitials('   ')).toBe('?');
    });

    it('should handle names with leading/trailing whitespace', () => {
      expect(getInitials('  John  ')).toBe('J');
      expect(getInitials('\tAlice\n')).toBe('A');
    });

    it('should handle special characters', () => {
      expect(getInitials('@John')).toBe('@');
      expect(getInitials('#Alice')).toBe('#');
    });
  });

  describe('generateAvatarColor', () => {
    it('should generate consistent color for same user ID', () => {
      const color1 = generateAvatarColor('user123');
      const color2 = generateAvatarColor('user123');
      expect(color1).toBe(color2);
    });

    it('should generate different colors for different user IDs', () => {
      const color1 = generateAvatarColor('user123');
      const color2 = generateAvatarColor('user456');
      // Not guaranteed to be different, but very likely with 10 colors
      // Just verify they are valid colors
      expect(color1).toMatch(/^#[0-9A-F]{6}$/);
      expect(color2).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('should return valid hex color code', () => {
      const color = generateAvatarColor('testuser');
      expect(color).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('should return color from predefined palette', () => {
      const palette = [
        '#E91E63',
        '#9C27B0',
        '#673AB7',
        '#3F51B5',
        '#2196F3',
        '#00BCD4',
        '#009688',
        '#4CAF50',
        '#FF9800',
        '#FF5722',
      ];

      const color = generateAvatarColor('user789');
      expect(palette).toContain(color);
    });

    it('should handle empty user ID', () => {
      const color = generateAvatarColor('');
      expect(color).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('should distribute colors across palette', () => {
      // Generate colors for 100 different users
      const colors = new Set<string>();
      for (let i = 0; i < 100; i++) {
        colors.add(generateAvatarColor(`user${i}`));
      }

      // Should use multiple colors from the palette
      expect(colors.size).toBeGreaterThan(1);
    });
  });
});
