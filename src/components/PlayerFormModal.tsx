import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useToast } from './ToastContainer';
import { createPlayer } from '../services/playerAdmin';
import { getPlayerImageWithFallback } from '../utils/minecraftSkin';

interface PlayerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Optional legacy handler. If provided, this will be used instead of the default DB service.
   * Keep signature to avoid breaking callers.
   */
  onSubmit?: (
    name: string,
    imageUrl: string,
    active: boolean,
    fullBodyUrl?: string,
    minecraftUsername?: string
  ) => Promise<{ success: boolean; error?: string }>;
  title: string;
  successMessage: string;
  initial?: {
    name: string;
    image_url: string;
    full_body_url?: string;
    minecraft_username?: string;
    active: boolean;
  };
}

const PlayerFormModal: React.FC<PlayerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  successMessage,
  initial
}) => {
  const [name, setName] = useState('');
  const [minecraftUsername, setMinecraftUsername] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [fullBodyUrl, setFullBodyUrl] = useState('');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (initial) {
      setName(initial.name || '');
      setMinecraftUsername((initial.minecraft_username || '').toString());
      setImageUrl(initial.image_url || '');
      setFullBodyUrl(initial.full_body_url || '');
      setActive(initial.active ?? true);
    } else {
      setName('');
      setMinecraftUsername('');
      setImageUrl('');
      setFullBodyUrl('');
      setActive(true);
    }
  }, [initial, isOpen]);

  if (!isOpen) return null;

  const skinUser = (minecraftUsername || name).trim();

  const handleSubmit = async () => {
    if (!name.trim()) {
      showToast({ type: 'error', title: 'Validation', message: 'Name is required' });
      return;
    }

    setLoading(true);

    // Prefer passed-in handler if supplied; otherwise use our Supabase service
    const result = onSubmit
      ? await onSubmit(name, imageUrl, active, fullBodyUrl, minecraftUsername)
      : await createPlayer(name, imageUrl, active, fullBodyUrl, minecraftUsername);

    if (result.success) {
      showToast({ type: 'success', title: successMessage, message: name });
      onClose();
    } else {
      showToast({ type: 'error', title: 'Error', message: result.error || 'Failed to save player' });
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-panel-gradient rounded-2xl w-full max-w-md border border-highlight shadow-2xl shadow-accent-glow">
        <div className="p-6 border-b border-highlight flex items-center justify-between">
          <h2 className="text-xl font-game font-bold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-highlight transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* ✅ Preview (cropped same as list) */}
        <div className="px-6 pt-6">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-base-dark border-2 border-highlight shadow-lg flex items-start justify-center">
              <img
                src={fullBodyUrl || getPlayerImageWithFallback(skinUser, 'body')}
                alt={name || 'player'}
                className="w-full h-auto object-cover scale-130 -translate-y-3 origin-top"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getPlayerImageWithFallback(skinUser, 'head');
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="text-text-primary font-semibold text-lg">{name || 'Preview'}</div>
              <div className="text-text-muted text-sm font-mono">
                Skin user: {minecraftUsername?.trim() || '(falls back to name)'}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-base-dark border border-highlight rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30 placeholder-text-muted"
              placeholder="Player name (shown on site)"
              disabled={loading}
            />
          </div>

          {/* ✅ NEW field: Minecraft Username (used for skin) */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Minecraft Username (for skin)</label>
            <input
              type="text"
              value={minecraftUsername}
              onChange={e => setMinecraftUsername(e.target.value)}
              className="w-full bg-base-dark border border-highlight rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30 placeholder-text-muted"
              placeholder="e.g. Notch (used only for skin)"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Image URL (legacy avatar)</label>
            <input
              type="text"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="w-full bg-base-dark border border-highlight rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30 placeholder-text-muted"
              placeholder="https://example.com/avatar.png"
              disabled={loading}
            />
          </div>

          {/* Keep Full Body URL as optional override */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Full Body URL (optional override)</label>
            <input
              type="text"
              value={fullBodyUrl}
              onChange={e => setFullBodyUrl(e.target.value)}
              className="w-full bg-base-dark border border-highlight rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30 placeholder-text-muted"
              placeholder="Optional direct image URL (if provided overrides username render)"
              disabled={loading}
            />
          </div>

          <label className="flex items-center gap-2 text-text-primary">
            <input
              type="checkbox"
              checked={active}
              onChange={e => setActive(e.target.checked)}
              disabled={loading}
            />
            Active
          </label>
        </div>

        <div className="p-6 border-t border-highlight flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-base-dark hover:bg-highlight text-text-secondary hover:text-text-primary border border-highlight hover:border-accent-primary/50 transition-all font-semibold"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 rounded-xl bg-accent-gradient text-white font-semibold flex items-center justify-center gap-2 hover:shadow-accent-glow transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerFormModal;
