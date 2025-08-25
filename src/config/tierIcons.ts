import {
  Crown,
  Trophy,
  Medal,
  Star,
  Diamond,
  Gem,
  Shield,
  Sword,
  Target,
  Circle,
  Award,
  Zap,
  Flame,
  Sparkles,
  type LucideIcon
} from 'lucide-react';
import { TierType } from '../types';

export interface TierIconConfig {
  id: TierType;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
  points: number;
  order: number;
}

export const TIER_ICONS: TierIconConfig[] = [
  {
    id: 'HT1',
    icon: Crown,
    color: '#fbbf24',
    bgColor: 'rgba(251, 191, 36, 0.15)',
    borderColor: '#fbbf24',
    label: 'HT1',
    points: 60,
    order: 1
  },
  {
    id: 'LT1',
    icon: Trophy,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: '#f59e0b',
    label: 'LT1',
    points: 45,
    order: 2
  },
  {
    id: 'HT2',
    icon: Medal,
    color: '#60a5fa',
    bgColor: 'rgba(96, 165, 250, 0.15)',
    borderColor: '#60a5fa',
    label: 'HT2',
    points: 30,
    order: 3
  },
  {
    id: 'LT2',
    icon: Star,
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: '#3b82f6',
    label: 'LT2',
    points: 20,
    order: 4
  },
  {
    id: 'HT3',
    icon: Diamond,
    color: '#a78bfa',
    bgColor: 'rgba(167, 139, 250, 0.15)',
    borderColor: '#a78bfa',
    label: 'HT3',
    points: 10,
    order: 5
  },
  {
    id: 'LT3',
    icon: Gem,
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: '#8b5cf6',
    label: 'LT3',
    points: 6,
    order: 6
  },
  {
    id: 'HT4',
    icon: Shield,
    color: '#34d399',
    bgColor: 'rgba(52, 211, 153, 0.15)',
    borderColor: '#34d399',
    label: 'HT4',
    points: 4,
    order: 7
  },
  {
    id: 'LT4',
    icon: Sword,
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10b981',
    label: 'LT4',
    points: 3,
    order: 8
  },
  {
    id: 'HT5',
    icon: Target,
    color: '#fb7185',
    bgColor: 'rgba(251, 113, 133, 0.15)',
    borderColor: '#fb7185',
    label: 'HT5',
    points: 2,
    order: 9
  },
  {
    id: 'LT5',
    icon: Zap,
    color: '#e11d48',
    bgColor: 'rgba(225, 29, 72, 0.15)',
    borderColor: '#e11d48',
    label: 'LT5',
    points: 1,
    order: 10
  },
  // Retired tiers
  {
    id: 'RHT1',
    icon: Award,
    color: '#92400e',
    bgColor: 'rgba(146, 64, 14, 0.15)',
    borderColor: '#92400e',
    label: 'RHT1',
    points: 30,
    order: 11
  },
  {
    id: 'RLT1',
    icon: Flame,
    color: '#78350f',
    bgColor: 'rgba(120, 53, 15, 0.15)',
    borderColor: '#78350f',
    label: 'RLT1',
    points: 22.5,
    order: 12
  },
  {
    id: 'RHT2',
    icon: Sparkles,
    color: '#1e40af',
    bgColor: 'rgba(30, 64, 175, 0.15)',
    borderColor: '#1e40af',
    label: 'RHT2',
    points: 15,
    order: 13
  },
  {
    id: 'RLT2',
    icon: Circle,
    color: '#1e3a8a',
    bgColor: 'rgba(30, 58, 138, 0.15)',
    borderColor: '#1e3a8a',
    label: 'RLT2',
    points: 10,
    order: 14
  },
  {
    id: 'UNRANKED',
    icon: Circle,
    color: '#6b7280',
    bgColor: 'rgba(107, 114, 128, 0.1)',
    borderColor: '#6b7280',
    label: '???',
    points: 0,
    order: 15
  }
];

export const getTierIconConfig = (tierId: TierType): TierIconConfig => {
  return TIER_ICONS.find(tier => tier.id === tierId) || TIER_ICONS[TIER_ICONS.length - 1];
};

export const getTierPoints = (tierId: TierType): number => {
  const tier = getTierIconConfig(tierId);
  return tier.points;
};