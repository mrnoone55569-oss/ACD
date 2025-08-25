import React, { useState } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  type: 'player' | 'kit' | 'global';
  playerName?: string;
  kitName?: string;
  isLoading?: boolean;
}

const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type,
  playerName,
  kitName,
  isLoading = false
}) => {
  const [confirmText, setConfirmText] = useState('');
  
  if (!isOpen) return null;

  const isGlobalReset = type === 'global';
  const canConfirm = isGlobalReset ? confirmText === 'RESET ALL' : true;

  const handleConfirm = () => {
    if (canConfirm) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-panel-gradient rounded-2xl w-full max-w-md border border-red-500/30 shadow-2xl shadow-red-500/20">
        {/* Header */}
        <div className="p-6 border-b border-red-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
                <AlertTriangle size={24} className="text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-game font-bold text-text-primary">{title}</h2>
                <p className="text-sm text-red-400">This action cannot be undone</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-highlight transition-colors"
              disabled={isLoading}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-text-secondary mb-4">{description}</p>
            
            {playerName && (
              <div className="bg-base-dark rounded-lg p-3 border border-highlight">
                <p className="text-sm text-text-muted">Player:</p>
                <p className="font-semibold text-accent-primary">{playerName}</p>
              </div>
            )}
            
            {kitName && (
              <div className="bg-base-dark rounded-lg p-3 border border-highlight">
                <p className="text-sm text-text-muted">Kit:</p>
                <p className="font-semibold text-accent-primary">{kitName}</p>
              </div>
            )}
          </div>

          {isGlobalReset && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Type "RESET ALL" to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full bg-base-dark border border-red-500/30 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/30 transition-all duration-300 placeholder-text-muted"
                placeholder="RESET ALL"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-base-dark hover:bg-highlight text-text-secondary hover:text-text-primary border border-highlight hover:border-accent-primary/50 transition-all duration-300 font-semibold"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm || isLoading}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                canConfirm && !isLoading
                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-400'
                  : 'bg-red-500/10 text-red-600 border border-red-500/20 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-400"></div>
                  Resetting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Reset Tiers
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmModal;
