import React from 'react';
import { TierType } from '../types';
import { getTierIconConfig } from '../config/tierIcons';

interface TierIconProps {
  tier: TierType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onClick?: () => void;
  className?: string;
}

const TierIcon: React.FC<TierIconProps> = ({ 
  tier, 
  size = 'md',
  showLabel = true,
  onClick,
  className = ''
}) => {
  const tierConfig = getTierIconConfig(tier);
  const Icon = tierConfig.icon;
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  
  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22
  };
  
  const labelSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  return (
    <div 
      className={`flex flex-col items-center gap-1.5 ${onClick ? 'cursor-pointer hover:scale-105 transition-all duration-200' : ''} ${className}`}
      onClick={onClick}
    >
      <div 
        className={`${sizeClasses[size]} rounded-xl flex items-center justify-center border-2 transition-all duration-200 shadow-lg relative overflow-hidden`}
        style={{
          backgroundColor: tierConfig.bgColor,
          borderColor: tierConfig.borderColor,
          boxShadow: `0 4px 12px ${tierConfig.color}25, inset 0 1px 0 rgba(255,255,255,0.1)`
        }}
      >
        {/* Subtle gradient overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(135deg, ${tierConfig.color}40, transparent)`
          }}
        />
        
        <Icon 
          size={iconSizes[size]} 
          color={tierConfig.color}
          strokeWidth={2.5}
          className="relative z-10"
        />
      </div>
      
      {showLabel && (
        <span 
          className={`font-mono font-bold ${labelSizes[size]} leading-none tracking-wide`}
          style={{ color: tierConfig.color }}
        >
          {tierConfig.label}
        </span>
      )}
    </div>
  );
};

export default TierIcon;