import React from 'react';
import { TierType } from '../types';
import { getTierConfig } from '../config/tiers';

interface TierBadgeProps {
  tier: TierType;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  isActive?: boolean;
}

const TierBadge: React.FC<TierBadgeProps> = ({ 
  tier, 
  size = 'md',
  onClick,
  isActive = false
}) => {
  const tierConfig = getTierConfig(tier);
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };
  
  return (
    <span 
      className={`
        inline-flex items-center justify-center font-mono font-bold rounded 
        ${sizeClasses[size]} 
        ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}
        ${isActive ? 'ring-2 ring-offset-1 ring-offset-base-dark' : ''}
      `}
      style={{
        backgroundColor: tierConfig.bgColor,
        color: tierConfig.color,
        border: `1px solid ${tierConfig.borderColor}`,
        boxShadow: isActive ? `0 0 8px ${tierConfig.color}` : undefined
      }}
      onClick={onClick}
    >
      {tierConfig.label}
    </span>
  );
};

export default TierBadge;