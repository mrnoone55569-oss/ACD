import React, { useState, useMemo } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import RankBadge from './RankBadge';
import { getPlayerImageWithFallback } from '../utils/minecraftSkin';

interface LeaderboardProps {
  limit?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ limit }) => {
  const { players } = usePlayerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'elo' | 'peak_elo'>('elo');

  const filteredAndSorted = useMemo(() => {
    return players
      .filter(p => p.active !== false && p.elo)
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const aValue = sortBy === 'elo' ? (a.elo || 0) : (a.peak_elo || 0);
        const bValue = sortBy === 'elo' ? (b.elo || 0) : (b.peak_elo || 0);
        return bValue - aValue;
      })
      .slice(0, limit);
  }, [players, searchTerm, sortBy, limit]);

  return (
    <div className="bg-panel-gradient rounded-xl p-6 border border-highlight shadow-lg shadow-accent-glow/20 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-game font-bold text-text-primary flex items-center">
          <TrendingUp size={24} className="mr-2 text-accent-primary" />
          ELO Leaderboard
        </h2>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-base-dark border border-highlight text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('elo')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === 'elo'
                ? 'bg-accent-gradient text-white'
                : 'bg-base-dark text-text-secondary border border-highlight hover:text-text-primary'
            }`}
          >
            Current ELO
          </button>
          <button
            onClick={() => setSortBy('peak_elo')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === 'peak_elo'
                ? 'bg-accent-gradient text-white'
                : 'bg-base-dark text-text-secondary border border-highlight hover:text-text-primary'
            }`}
          >
            Peak ELO
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-highlight">
              <th className="text-left py-3 px-4 font-semibold text-text-secondary">#</th>
              <th className="text-left py-3 px-4 font-semibold text-text-secondary">Player</th>
              <th className="text-center py-3 px-4 font-semibold text-text-secondary">Current ELO</th>
              <th className="text-center py-3 px-4 font-semibold text-text-secondary">Peak ELO</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((player, index) => (
              <tr
                key={player.id}
                className="border-b border-highlight/30 hover:bg-highlight/10 transition-colors"
              >
                <td className="py-3 px-4 font-bold text-accent-primary">{index + 1}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-base-dark border border-highlight flex items-start justify-center">
                      <img
                        src={getPlayerImageWithFallback(player.minecraft_username || player.name, 'head')}
                        alt={player.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getPlayerImageWithFallback(player.name, 'head');
                        }}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary">{player.name}</div>
                      <div className="text-xs text-text-muted">{player.minecraft_username || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center">
                    <RankBadge elo={player.elo || 0} size="sm" showLabel={false} />
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="font-mono font-semibold text-accent-primary">
                    {player.peak_elo || 0}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-8 text-text-muted">
            <p>No players found</p>
          </div>
        )}
      </div>

      {limit && players.filter(p => p.active !== false && p.elo).length > limit && (
        <div className="mt-4 text-center text-sm text-text-muted">
          Showing top {limit} of {players.filter(p => p.active !== false && p.elo).length} players
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
