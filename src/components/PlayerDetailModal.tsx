import React from 'react';
import ReactDOM from 'react-dom';
import { X, Trophy, Star, Crown, TrendingUp } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { useAuthStore } from '../store/authStore';
import { KITS } from '../config/kits';
import { getTierIconConfig } from '../config/tierIcons';
import { getKitIcon } from '../config/kits';
import { KitId, TierType } from '../types';
import TierSelector from './TierSelector';
import TierIcon from './TierIcon';
import { getPlayerImageWithFallback } from '../utils/minecraftSkin';

// services
import { setCurrentTier, setPeakTier } from '../services/playerPersistence';
import { refreshPlayersInStore } from '../services/playerQuery';

interface PlayerDetailModalProps {
  playerId: string;
  onClose: () => void;
}

const POPOVER_WIDTH = 280;
const POPOVER_HEIGHT = 360;
const POPOVER_GAP = 8;

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
// tolerate either camelCase or lowercase from the store
const pickPeakMap = (p: any) =>
  ((p?.peakTiers ?? p?.peaktiers) ?? {}) as Record<string, TierType>;

// Get Minecraft username for skin rendering (matches PlayerList logic)
const getSkinUsername = (player: any) => {
  const u = player?.minecraft_username ?? player?.minecraftUsername ?? player?.mc_username ?? player?.mcUsername;
  const cleaned = typeof u === 'string' ? u.trim() : '';
  return cleaned || player?.name;
};

const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ playerId, onClose }) => {
  const { players } = usePlayerStore();
  const { isAuthenticated } = useAuthStore();
  const player = players.find(p => p.id === playerId);

  // Local optimistic state so the modal updates immediately
  const [localKitTiers, setLocalKitTiers] = React.useState<Record<string, TierType>>(
    () => (player?.kitTiers ?? {}) as Record<string, TierType>
  );
  const [localPeakTiers, setLocalPeakTiers] = React.useState<Record<string, TierType>>(
    () => pickPeakMap(player)
  );

  // Resync if player or their tier maps change
  React.useEffect(() => {
    if (player) {
      setLocalKitTiers((player.kitTiers ?? {}) as Record<string, TierType>);
      setLocalPeakTiers(pickPeakMap(player)); // stays independent
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player?.id, (player as any)?.kitTiers, (player as any)?.peakTiers, (player as any)?.peaktiers]);

  // Which kit is being edited (current tier or peak), and where to place the popover
  const [editingKit, setEditingKit] = React.useState<KitId | null>(null);
  const [editingPeakKit, setEditingPeakKit] = React.useState<KitId | null>(null);
  const [selectorPos, setSelectorPos] = React.useState<{ left: number; top: number } | null>(null);

  if (!player) return null;

  // Calculate total points (use local optimistic data)
  const totalPoints = KITS.filter(kit => kit.id !== 'overall').reduce((total, kit) => {
    const tier = (localKitTiers[kit.id] as TierType) || 'UNRANKED';
    return total + getTierIconConfig(tier).points;
  }, 0);

  const rankedKits = KITS.filter(
    kit => kit.id !== 'overall' && (localKitTiers[kit.id] as TierType) !== 'UNRANKED'
  );
  const unrankedKits = KITS.filter(
    kit => kit.id !== 'overall' && ((localKitTiers[kit.id] as TierType) ?? 'UNRANKED') === 'UNRANKED'
  );

  // Compute a safe on-screen position for the popover near the clicked element
  const computePopoverPosition = (anchorEl: HTMLElement) => {
    const rect = anchorEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = rect.right + POPOVER_GAP;
    if (left + POPOVER_WIDTH > vw - POPOVER_GAP) {
      left = rect.left - POPOVER_GAP - POPOVER_WIDTH;
    }
    left = clamp(left, POPOVER_GAP, vw - POPOVER_WIDTH - POPOVER_GAP);

    let top = rect.top;
    if (top + POPOVER_HEIGHT > vh - POPOVER_GAP) {
      top = vh - POPOVER_HEIGHT - POPOVER_GAP;
    }
    top = clamp(top, POPOVER_GAP, vh - POPOVER_HEIGHT - POPOVER_GAP);

    return { left, top };
  };

  const openSelectorAtEvent = (e: React.MouseEvent, kind: 'current' | 'peak', kitId: KitId) => {
    e.stopPropagation();
    if (!isAuthenticated) return;

    const anchor = e.currentTarget as HTMLElement;
    const pos = computePopoverPosition(anchor);

    setSelectorPos(pos);
    if (kind === 'current') {
      setEditingPeakKit(null);
      setEditingKit(kitId);
    } else {
      setEditingKit(null);
      setEditingPeakKit(kitId);
    }
  };

  // CURRENT tier: optimistic local update + persist + global refresh
  const handleTierSelect = async (tier: TierType) => {
    if (!editingKit) return;
    const kitId = editingKit;

    const prev = (localKitTiers[kitId] as TierType) ?? 'UNRANKED';
    setLocalKitTiers(s => ({ ...s, [kitId]: tier }));

    try {
      await setCurrentTier(playerId, kitId, tier);
      await refreshPlayersInStore();
    } catch (err) {
      console.error('Failed to save current tier:', err);
      setLocalKitTiers(s => ({ ...s, [kitId]: prev }));
    } finally {
      setEditingKit(null);
      setSelectorPos(null);
    }
  };

  // PEAK tier: optimistic local update + persist + global refresh
  const handlePeakTierSelect = async (tier: TierType) => {
    if (!editingPeakKit) return;
    const kitId = editingPeakKit;

    const prev = (localPeakTiers[kitId] as TierType) ?? 'UNRANKED';
    setLocalPeakTiers(s => ({ ...s, [kitId]: tier }));

    try {
      await setPeakTier(playerId, kitId, tier);
      await refreshPlayersInStore();
    } catch (err) {
      console.error('Failed to save peak tier:', err);
      setLocalPeakTiers(s => ({ ...s, [kitId]: prev }));
    } finally {
      setEditingPeakKit(null);
      setSelectorPos(null);
    }
  };

  // Close selector on Escape or resize
  React.useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        setEditingKit(null);
        setEditingPeakKit(null);
        setSelectorPos(null);
      }
    };
    const onResize = () => {
      setEditingKit(null);
      setEditingPeakKit(null);
      setSelectorPos(null);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Render TierSelector in a portal at a fixed screen position (prevents clipping)
  const renderSelectorPortal = (mode: 'current' | 'peak') => {
    if (!selectorPos) return null;

    const onClose = () => {
      if (mode === 'current') setEditingKit(null);
      else setEditingPeakKit(null);
      setSelectorPos(null);
    };

    const onSelect = mode === 'current' ? handleTierSelect : handlePeakTierSelect;

    return ReactDOM.createPortal(
      <div
        style={{
          position: 'fixed',
          left: selectorPos.left,
          top: selectorPos.top,
          zIndex: 9999,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <TierSelector onSelect={onSelect} onClose={onClose} />
      </div>,
      document.body
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-panel-gradient rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-highlight shadow-2xl shadow-accent-glow">
        {/* Header */}
        <div className="sticky top-0 bg-base-dark rounded-t-2xl p-6 border-b border-highlight flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-base-dark border-2 border-highlight shadow-lg flex items-start justify-center">
              <img
                src={player.full_body_url || getPlayerImageWithFallback(getSkinUsername(player), 'body')}
                alt={player.name}
                className="w-full h-auto object-cover scale-[1.3] -translate-y-3 origin-top"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const skinUser = getSkinUsername(player);
                  if (target.src !== getPlayerImageWithFallback(skinUser, 'head')) {
                    target.src = getPlayerImageWithFallback(skinUser, 'head');
                  }
                }}
              />
            </div>
            <div>
              <h2 className="text-2xl font-game font-bold text-text-primary">{player.name}</h2>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center text-accent-primary">
                  <Trophy size={16} className="mr-1" />
                  <span className="font-mono font-bold">{totalPoints} points</span>
                </div>
                <div className="flex items-center text-accent-secondary">
                  <Star size={16} className="mr-1" />
                  <span className="text-sm">{rankedKits.length}/{KITS.length - 1} kits ranked</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-highlight transition-colors border border-transparent hover:border-accent-primary/30"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Ranked Kits */}
          {rankedKits.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-game font-bold text-text-primary mb-4 flex items-center">
                <Crown size={18} className="mr-2 text-accent-primary" />
                Ranked Kits ({rankedKits.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rankedKits
                  .sort((a, b) => {
                    const aTier = (localKitTiers[a.id] as TierType) || 'UNRANKED';
                    const bTier = (localKitTiers[b.id] as TierType) || 'UNRANKED';
                    const aPoints = getTierIconConfig(aTier).points;
                    const bPoints = getTierIconConfig(bTier).points;
                    return bPoints - aPoints;
                  })
                  .map(kit => {
                    const tier = (localKitTiers[kit.id] as TierType) || 'UNRANKED';
                    const tierConfig = getTierIconConfig(tier);
                    const peakTier = (localPeakTiers[kit.id] as TierType) ?? 'UNRANKED';
                    const KitIcon = getKitIcon(kit.id);

                    return (
                      <div
                        key={kit.id}
                        className={`bg-base-dark rounded-xl p-4 border border-highlight transition-all duration-300 relative ${
                          isAuthenticated
                            ? 'hover:border-accent-primary/50 hover:shadow-accent-glow/20'
                            : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Kit Icon */}
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center border-2 shadow-lg relative overflow-hidden flex-shrink-0"
                            style={{ backgroundColor: `${kit.color}15`, borderColor: kit.color }}
                          >
                            <KitIcon size={20} color={kit.color} strokeWidth={2} />
                          </div>

                          {/* Kit Info */}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-text-primary">{kit.name}</div>
                            <div className="text-sm text-text-secondary">Kit Category</div>
                          </div>

                          {/* Tier Badges */}
                          <div className="flex items-center gap-3 relative">
                            {/* Peak Tier Indicator (show only if present) */}
                            <div className="flex flex-col items-center">
                              <div className="text-xs text-text-muted mb-1 flex items-center gap-1">
                                <TrendingUp size={10} />
                                Peak
                              </div>
                              {peakTier !== 'UNRANKED' && (
                                <div
                                  className={`relative ${isAuthenticated ? 'cursor-pointer hover:scale-110' : ''} transition-all duration-200`}
                                  onClick={(e) => openSelectorAtEvent(e, 'peak', kit.id as KitId)}
                                  title={`Peak: ${getTierIconConfig(peakTier).label} (Click to edit)`}
                                >
                                  <TierIcon tier={peakTier} size="sm" showLabel={false} />
                                </div>
                              )}
                            </div>

                            {/* Current Tier Badge */}
                            <div className="flex flex-col items-end">
                              <div className="text-xs text-text-muted mb-1">Current</div>
                              <button
                                type="button"
                                className={`px-3 py-1.5 rounded-lg border-2 font-mono font-bold text-sm shadow-lg transition-all duration-200 ${
                                  isAuthenticated ? 'hover:scale-105 cursor-pointer' : ''
                                }`}
                                style={{
                                  backgroundColor: tierConfig.bgColor,
                                  borderColor: tierConfig.borderColor,
                                  color: tierConfig.color
                                }}
                                onClick={(e) => openSelectorAtEvent(e, 'current', kit.id as KitId)}
                                title={`Current: ${tierConfig.label} (Click to edit)`}
                              >
                                {tierConfig.label}
                              </button>
                              <div className="text-xs text-text-muted mt-1">
                                {tierConfig.points} pts
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Unranked Kits */}
          {unrankedKits.length > 0 && (
            <div>
              <h3 className="text-lg font-game font-bold text-text-secondary mb-4 flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-600 mr-2"></div>
                Unranked Kits ({unrankedKits.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {unrankedKits.map(kit => {
                  const KitIcon = getKitIcon(kit.id);
                  const peakTier = (localPeakTiers[kit.id] as TierType) ?? 'UNRANKED';

                  return (
                    <div
                      key={kit.id}
                      className={`bg-base-dark/50 rounded-lg p-3 border border-gray-700 text-center transition-colors relative ${
                        isAuthenticated ? 'hover:border-accent-primary/30' : ''
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-600 mx-auto mb-2"
                        style={{ backgroundColor: `${kit.color}10`, borderColor: `${kit.color}30` }}
                      >
                        <KitIcon size={16} color={`${kit.color}80`} strokeWidth={2} />
                      </div>

                      {/* Peak tier for unranked kits (show only if present) */}
                      {peakTier !== 'UNRANKED' && (
                        <div className="absolute top-1 left-1">
                          <div
                            className={`${isAuthenticated ? 'cursor-pointer hover:scale-110' : ''} transition-all duration-200`}
                            onClick={(e) => openSelectorAtEvent(e, 'peak', kit.id as KitId)}
                            title={`Peak: ${getTierIconConfig(peakTier).label}`}
                          >
                            <TierIcon tier={peakTier} size="sm" showLabel={false} />
                          </div>
                        </div>
                      )}

                      <div className="text-sm text-text-muted">{kit.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No rankings message */}
          {rankedKits.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-panel border border-highlight flex items-center justify-center mx-auto mb-4">
                <Crown size={24} className="text-text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-text-secondary mb-2">No Rankings Yet</h3>
              <p className="text-text-muted text-sm">This player hasn't been ranked in any kit categories.</p>
            </div>
          )}
        </div>
      </div>

      {/* Portaled selectors so they never clip */}
      {editingKit && renderSelectorPortal('current')}
      {editingPeakKit && renderSelectorPortal('peak')}
    </div>
  );
};

export default PlayerDetailModal;
