import { TierType } from '../types';

/**
 * Tier sorting utility to order tiers by value correctly
 */

interface TierInfo {
  tier: TierType;
  number: number;
  type: 'HT' | 'LT';
  isRetired: boolean;
}

function parseTierType(tier: TierType): TierInfo | null {
  if (tier === 'UNRANKED') {
    return { tier, number: 999, type: 'LT', isRetired: false };
  }

  // Match patterns like HT1, LT1, RHT1, RLT1, etc.
  const match = tier.match(/^(R?)([HL]T)(\d+)$/);
  if (!match) {
    // Unknown format, put at end
    return { tier, number: 998, type: 'LT', isRetired: false };
  }

  const [, retiredPrefix, tierType, numberStr] = match;
  const number = parseInt(numberStr, 10);
  const isRetired = retiredPrefix === 'R';
  const type = tierType as 'HT' | 'LT';

  return { tier, number, type, isRetired };
}

/**
 * Sort tiers in the correct value order:
 * HT1, RHT1, LT1, RLT1, HT2, RHT2, LT2, RLT2, etc.
 */
export function sortTiersByValue(tiers: TierType[]): TierType[] {
  const tierInfos = tiers
    .map(parseTierType)
    .filter((info): info is TierInfo => info !== null);

  tierInfos.sort((a, b) => {
    // 1. Sort by tier number (1, 2, 3, ...)
    if (a.number !== b.number) {
      return a.number - b.number;
    }

    // 2. Within same number, HT before LT
    if (a.type !== b.type) {
      return a.type === 'HT' ? -1 : 1;
    }

    // 3. Within same type, Main before Retired
    if (a.isRetired !== b.isRetired) {
      return a.isRetired ? 1 : -1;
    }

    // 4. Fallback to string comparison for stability
    return a.tier.localeCompare(b.tier);
  });

  return tierInfos.map(info => info.tier);
}

/**
 * Get tier sort priority for individual tier comparison
 */
export function getTierSortPriority(tier: TierType): number {
  const info = parseTierType(tier);
  if (!info) return 9999;

  // Create a numeric priority: number * 100 + type * 10 + retired
  const typeValue = info.type === 'HT' ? 0 : 1;
  const retiredValue = info.isRetired ? 1 : 0;
  
  return info.number * 100 + typeValue * 10 + retiredValue;
}