/**
 * Avatar Utility Functions
 * Shared logic for avatar placeholder generation across mobile and web platforms
 */

/**
 * Generate a consistent color based on user ID
 * @param userId - User ID for consistent color generation
 * @returns Hex color string
 */
export function generateAvatarColor(userId: string): string {
  // Hash the user ID to generate a number
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate color from hash (using pleasant color palette)
  const colors = [
    '#E91E63', // Pink
    '#9C27B0', // Purple
    '#673AB7', // Deep Purple
    '#3F51B5', // Indigo
    '#2196F3', // Blue
    '#00BCD4', // Cyan
    '#009688', // Teal
    '#4CAF50', // Green
    '#FF9800', // Orange
    '#FF5722', // Deep Orange
  ];

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Extract initials from display name
 * @param displayName - User's display name
 * @returns Initials (first letter of first name)
 */
export function getInitials(displayName: string): string {
  if (!displayName || displayName.trim().length === 0) {
    return '?';
  }

  const words = displayName.trim().split(/\s+/);
  if (words.length === 0) return '?';

  // Take first letter of first name only
  return words[0].charAt(0).toUpperCase();
}
