import React, { useState, useEffect, useCallback } from 'react';
import { X, TrendingUp, Award } from 'lucide-react';
import { Player, TournamentParticipant } from '../types';
import RankBadge from './RankBadge';
import { getPlayerImageWithFallback } from '../utils/minecraftSkin';
import { fetchPlayerTournamentHistory } from '../services/tournamentService';

interface PlayerProfileProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({ player, isOpen, onClose }) => {
  const [history, setHistory] = useState<TournamentParticipant[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTournamentHistory = useCallback(async () => {
    setLoading(true);
    const result = await fetchPlayerTournamentHistory(player.id);
    if (result.success && result.data) {
      setHistory(result.data);
    }
    setLoading(false);
  }, [player.id]);

  useEffect(() => {
    if (isOpen && player.id) {
      loadTournamentHistory();
    }
  }, [isOpen, player.id, loadTournamentHistory]);

  if (!isOpen) return null;

  const totalTournaments = history.length;
  const avgEloChange = history.length > 0
    ? Math.round(history.reduce((sum, h) => sum + h.elo_change, 0) / history.length)
    : 0;
  const wins = history.filter(h => h.elo_change > 0).length;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-panel-gradient rounded-2xl w-full max-w-2xl border border-highlight shadow-2xl shadow-accent-glow/20 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-highlight flex items-center justify-between sticky top-0 bg-panel-gradient">
          <h2 className="text-2xl font-game font-bold text-text-primary">Player Profile</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-highlight transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Player Header */}
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 rounded-xl overflow-hidden bg-base-dark border-2 border-highlight flex items-start justify-center">
              <img
                src={getPlayerImageWithFallback(player.minecraft_username || player.name, 'body')}
                alt={player.name}
                className="w-full h-auto object-cover scale-150 -translate-y-6 origin-top"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getPlayerImageWithFallback(player.name, 'head');
                }}
              />
            </div>

            <div className="flex-1">
              <h3 className="text-3xl font-bold text-text-primary mb-2">{player.name}</h3>
              <p className="text-text-secondary mb-4">{player.minecraft_username || 'N/A'}</p>

              <div className="flex items-end gap-6">
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wide mb-2">Current ELO</div>
                  <div className="text-3xl font-bold text-text-primary">{player.elo || 0}</div>
                </div>
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wide mb-2">Peak ELO</div>
                  <div className="text-3xl font-bold text-accent-primary">{player.peak_elo || 0}</div>
                </div>
              </div>
            </div>

            <div>
              <RankBadge elo={player.elo || 0} size="lg" />
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-base-dark rounded-xl border border-highlight/30">
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary">{totalTournaments}</div>
              <div className="text-xs text-text-muted uppercase">Tournaments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-primary">{wins}</div>
              <div className="text-xs text-text-muted uppercase">Wins</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${avgEloChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {avgEloChange >= 0 ? '+' : ''}{avgEloChange}
              </div>
              <div className="text-xs text-text-muted uppercase">Avg Change</div>
            </div>
          </div>

          {/* Tournament History */}
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <Award size={18} className="mr-2 text-accent-primary" />
              Tournament History
            </h4>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary mx-auto"></div>
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-3">
                {history.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="p-4 bg-base-dark rounded-lg border border-highlight/30 hover:border-highlight/60 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-text-muted">#{index + 1}</span>
                        <span className="font-semibold text-text-primary">
                          {entry.placement ? `Placement: ${entry.placement}` : 'Tournament'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-text-secondary">{entry.elo_before}</span>
                        <TrendingUp size={16} className="text-text-secondary" />
                        <span className={`text-sm font-bold ${entry.elo_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {entry.elo_change >= 0 ? '+' : ''}{entry.elo_change}
                        </span>
                        <span className="text-sm text-text-secondary">{entry.elo_after}</span>
                      </div>
                    </div>
                    <div className="text-xs text-text-muted">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-text-muted">
                <p>No tournament history</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
