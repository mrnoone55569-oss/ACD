import { TierConfig } from '../types';

export const TIERS: TierConfig[] = [
  {
    id: 'HT1',
    label: 'HT1',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.5)',
    points: 60
  },
  {
    id: 'LT1',
    label: 'LT1',
    color: '#d97706',
    bgColor: 'rgba(217, 119, 6, 0.1)',
    borderColor: 'rgba(217, 119, 6, 0.5)',
    points: 45
  },
  {
    id: 'HT2',
    label: 'HT2',
    color: '#60a5fa',
    bgColor: 'rgba(96, 165, 250, 0.1)',
    borderColor: 'rgba(96, 165, 250, 0.5)',
    points: 30
  },
  {
    id: 'LT2',
    label: 'LT2',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
    points: 20
  },
  {
    id: 'HT3',
    label: 'HT3',
    color: '#a78bfa',
    bgColor: 'rgba(167, 139, 250, 0.1)',
    borderColor: 'rgba(167, 139, 250, 0.5)',
    points: 10
  },
  {
    id: 'LT3',
    label: 'LT3',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(139, 92, 246, 0.5)',
    points: 6
  },
  {
    id: 'HT4',
    label: 'HT4',
    color: '#34d399',
    bgColor: 'rgba(52, 211, 153, 0.1)',
    borderColor: 'rgba(52, 211, 153, 0.5)',
    points: 4
  },
  {
    id: 'LT4',
    label: 'LT4',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.5)',
    points: 3
  },
  {
    id: 'HT5',
    label: 'HT5',
    color: '#fb7185',
    bgColor: 'rgba(251, 113, 133, 0.1)',
    borderColor: 'rgba(251, 113, 133, 0.5)',
    points: 2
  },
  {
    id: 'LT5',
    label: 'LT5',
    color: '#e11d48',
    bgColor: 'rgba(225, 29, 72, 0.1)',
    borderColor: 'rgba(225, 29, 72, 0.5)',
    points: 1
  },
  // Retired tiers (half points of original)
  {
    id: 'RHT1',
    label: 'RHT1',
    color: '#92400e',
    bgColor: 'rgba(146, 64, 14, 0.1)',
    borderColor: 'rgba(146, 64, 14, 0.5)',
    points: 30
  },
  {
    id: 'RLT1',
    label: 'RLT1',
    color: '#78350f',
    bgColor: 'rgba(120, 53, 15, 0.1)',
    borderColor: 'rgba(120, 53, 15, 0.5)',
    points: 22.5
  },
  {
    id: 'RHT2',
    label: 'RHT2',
    color: '#1e40af',
    bgColor: 'rgba(30, 64, 175, 0.1)',
    borderColor: 'rgba(30, 64, 175, 0.5)',
    points: 15
  },
  {
    id: 'RLT2',
    label: 'RLT2',
    color: '#1e3a8a',
    bgColor: 'rgba(30, 58, 138, 0.1)',
    borderColor: 'rgba(30, 58, 138, 0.5)',
    points: 10
  },
  {
    id: 'UNRANKED',
    label: '???',
    color: '#6b7280',
    bgColor: 'rgba(107, 114, 128, 0.1)',
    borderColor: 'rgba(107, 114, 128, 0.5)',
    points: 0
  }
];

export const getTierConfig = (tierId: string): TierConfig => {
  return TIERS.find(tier => tier.id === tierId) || TIERS[TIERS.length - 1];
};

export const getTierPoints = (tierId: string): number => {
  const tier = getTierConfig(tierId);
  return tier.points || 0;
};