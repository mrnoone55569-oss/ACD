import React from 'react';
import { getEloRank, getRankColor } from '../services/eloCalculation';

interface RankBadgeProps {
  elo: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const RankBadge: React.FC<RankBadgeProps> = ({ elo, size = 'md', showLabel = true }) => {
  const rank = getEloRank(elo);
  const color = getRankColor(elo);

  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-24 h-24 text-lg'
  };

  const getLadgeContent = () => {
    const points: Array<[number, number]> = [
      [0.5, 0.1],
      [0.8, 0.2],
      [0.9, 0.5],
      [0.8, 0.8],
      [0.5, 0.9],
      [0.2, 0.8],
      [0.1, 0.5],
      [0.2, 0.2]
    ];

    return points
      .map(([x, y]) => `${x * 100},${y * 100}`)
      .join(' ');
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.2))' }}
        >
          <polygon
            points={getLadgeContent()}
            fill={color}
            opacity="0.9"
            stroke={color}
            strokeWidth="2"
          />
          <polygon
            points={getLadgeContent()}
            fill="none"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1.5"
          />
        </svg>

        <div className="relative flex flex-col items-center justify-center font-bold text-white drop-shadow-lg">
          <span>{elo}</span>
          <span className="text-xs opacity-80">{rank.split(' ')[0]}</span>
        </div>
      </div>

      {showLabel && (
        <span className="text-center text-sm font-semibold" style={{ color }}>
          {rank}
        </span>
      )}
    </div>
  );
};

export default RankBadge;
