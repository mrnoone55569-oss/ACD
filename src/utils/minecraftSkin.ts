/**
 * Utility functions for Minecraft skin rendering
 */

export function getPlayerSkinUrl(username: string): string {
  if (!username || username.trim() === '') {
    return getDefaultPlayerImage();
  }

  // Use Crafatar for full body renders - reliable service with good fallbacks
  const cleanUsername = username.trim();
  return `https://crafatar.com/renders/body/${cleanUsername}?overlay=true&size=128`;
}

export function getPlayerHeadUrl(username: string): string {
  if (!username || username.trim() === '') {
    return getDefaultPlayerImage();
  }

  const cleanUsername = username.trim();
  return `https://crafatar.com/avatars/${cleanUsername}?overlay=true&size=128`;
}

export function getDefaultPlayerImage(): string {
  // Fallback to a generic Minecraft Steve skin
  return 'https://crafatar.com/renders/body/Steve?overlay=true&size=128';
}

/**
 * Get the appropriate image URL with fallback chain
 */
export function getPlayerImageWithFallback(
  username: string, 
  preferredType: 'body' | 'head' = 'body'
): string {
  if (!username || username.trim() === '') {
    return getDefaultPlayerImage();
  }

  if (preferredType === 'body') {
    return getPlayerSkinUrl(username);
  } else {
    return getPlayerHeadUrl(username);
  }
}