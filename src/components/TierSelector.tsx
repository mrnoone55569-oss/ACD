import React, { useEffect, useRef } from 'react';
import { TIER_ICONS } from '../config/tierIcons';
import TierIcon from './TierIcon';
import { TierType } from '../types';

interface TierSelectorProps {
  onSelect: (tier: TierType) => void;
  onClose: () => void;
}

const TierSelector: React.FC<TierSelectorProps> = ({ onSelect, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  return (
    <div 
      ref={ref}
      className="absolute right-0 top-0 z-20 bg-base-dark border border-highlight rounded-xl p-4 shadow-2xl min-w-max"
      style={{ transform: 'translateY(-50%)' }}
    >
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-text-secondary mb-3">Select Tier</h4>
        <div className="grid grid-cols-5 gap-3">
          {TIER_ICONS.filter(tier => tier.id !== 'UNRANKED').map(tier => (
            <div 
              key={tier.id} 
              onClick={() => onSelect(tier.id as TierType)}
              className="cursor-pointer hover:scale-110 transition-all duration-200"
            >
              <TierIcon tier={tier.id as TierType} size="sm" showLabel={true} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Unranked option */}
      <div className="pt-3 border-t border-highlight">
        <div className="text-xs text-text-muted mb-2">Remove Ranking</div>
        <div 
          onClick={() => onSelect('UNRANKED')}
          className="cursor-pointer hover:scale-110 transition-all duration-200 flex justify-center"
        >
          <TierIcon tier="UNRANKED" size="sm" showLabel={true} />
        </div>
      </div>
    </div>
  );
};

export default TierSelector;