type RenderType = 'head' | 'body' | 'full';

/**
 * Gets a Minecraft player avatar/skin image URL with fallback support
 * Uses mc-heads.net for avatar rendering
 *
 * @param playerName - The Minecraft username
 * @param renderType - The type of render (head, body, or full)
 * @returns The URL for the player's avatar/skin
 */
export function getPlayerImageWithFallback(
  playerName: string,
  renderType: RenderType = 'head'
): string {
  if (!playerName) {
    return `https://ui-avatars.com/api/?name=Unknown&background=random`;
  }

  // Use mc-heads.net for reliable Minecraft avatar rendering
  switch (renderType) {
    case 'head':
      return `https://mc-heads.net/avatar/${encodeURIComponent(playerName)}`;
    case 'body':
      return `https://mc-heads.net/body/${encodeURIComponent(playerName)}`;
    case 'full':
      return `https://mc-heads.net/player/${encodeURIComponent(playerName)}`;
    default:
      return `https://mc-heads.net/avatar/${encodeURIComponent(playerName)}`;
  }
}

/**
 * Gets a Minecraft player head avatar URL
 *
 * @param playerName - The Minecraft username
 * @returns The URL for the player's head avatar
 */
export function getMinecraftHead(playerName: string): string {
  return getPlayerImageWithFallback(playerName, 'head');
}

/**
 * Gets a Minecraft player body render URL
 *
 * @param playerName - The Minecraft username
 * @returns The URL for the player's body render
 */
export function getMinecraftBody(playerName: string): string {
  return getPlayerImageWithFallback(playerName, 'body');
}
