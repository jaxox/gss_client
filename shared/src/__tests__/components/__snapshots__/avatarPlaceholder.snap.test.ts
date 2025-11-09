/**
 * Avatar Placeholder Snapshot Tests
 * Tests visual consistency of avatar placeholder generation
 */

import { getInitials, generateAvatarColor } from '../../../components/avatarUtils';

describe('Avatar Placeholder Snapshots', () => {
  describe('getInitials snapshots', () => {
    it('should match snapshot for single name', () => {
      expect(getInitials('Alice')).toMatchSnapshot();
    });

    it('should match snapshot for full name', () => {
      expect(getInitials('John Smith')).toMatchSnapshot();
    });

    it('should match snapshot for three names', () => {
      expect(getInitials('Mary Jane Watson')).toMatchSnapshot();
    });

    it('should match snapshot for name with special characters', () => {
      expect(getInitials("O'Brien")).toMatchSnapshot();
    });

    it('should match snapshot for lowercase name', () => {
      expect(getInitials('alice cooper')).toMatchSnapshot();
    });

    it('should match snapshot for empty string', () => {
      expect(getInitials('')).toMatchSnapshot();
    });

    it('should match snapshot for whitespace only', () => {
      expect(getInitials('   ')).toMatchSnapshot();
    });

    it('should match snapshot for numbers in name', () => {
      expect(getInitials('User123')).toMatchSnapshot();
    });
  });

  describe('generateAvatarColor snapshots', () => {
    it('should match snapshot for user ID 1', () => {
      expect(generateAvatarColor('user-1')).toMatchSnapshot();
    });

    it('should match snapshot for user ID 2', () => {
      expect(generateAvatarColor('user-2')).toMatchSnapshot();
    });

    it('should match snapshot for user ID 3', () => {
      expect(generateAvatarColor('user-3')).toMatchSnapshot();
    });

    it('should match snapshot for UUID format', () => {
      expect(generateAvatarColor('550e8400-e29b-41d4-a716-446655440000')).toMatchSnapshot();
    });

    it('should match snapshot for short ID', () => {
      expect(generateAvatarColor('abc')).toMatchSnapshot();
    });

    it('should match snapshot for numeric ID', () => {
      expect(generateAvatarColor('12345')).toMatchSnapshot();
    });

    it('should match snapshot for empty string ID', () => {
      expect(generateAvatarColor('')).toMatchSnapshot();
    });
  });

  describe('Color consistency snapshots', () => {
    it('should match color palette array', () => {
      const testIds = ['test-1', 'test-2', 'test-3', 'test-4', 'test-5'];
      const colors = testIds.map(id => generateAvatarColor(id));
      expect(colors).toMatchSnapshot();
    });

    it('should match initials for common names', () => {
      const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
      const initials = names.map(name => getInitials(name));
      expect(initials).toMatchSnapshot();
    });

    it('should match full name initials', () => {
      const fullNames = [
        'John Smith',
        'Jane Doe',
        'Michael Johnson',
        'Sarah Williams',
        'David Brown',
      ];
      const initials = fullNames.map(name => getInitials(name));
      expect(initials).toMatchSnapshot();
    });
  });

  describe('Avatar placeholder combinations', () => {
    interface AvatarData {
      name: string;
      initials: string;
      color: string;
    }

    it('should match complete avatar data snapshot', () => {
      const users = [
        { id: 'user-1', name: 'Alice Johnson' },
        { id: 'user-2', name: 'Bob Smith' },
        { id: 'user-3', name: 'Charlie Brown' },
      ];

      const avatarData: AvatarData[] = users.map(user => ({
        name: user.name,
        initials: getInitials(user.name),
        color: generateAvatarColor(user.id),
      }));

      expect(avatarData).toMatchSnapshot();
    });
  });
});
