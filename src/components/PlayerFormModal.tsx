import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useToast } from './ToastContainer';
import { createPlayer } from '../services/playerAdmin';

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
    active: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  title: string;
  successMessage: string;
  initial?: {
    name: string;
    image_url: string;
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
  const [imageUrl, setImageUrl] = useState('');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (initial) {
      setName(initial.name || '');
      setImageUrl(initial.image_url || '');
      setActive(initial.active ?? true);
    } else {
      setName('');
      setImageUrl('');
      setActive(true);
    }
  }, [initial, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name.trim()) {
      showToast({ type: 'error', title: 'Validation', message: 'Name is required' });
      return;
    }

    setLoading(true);

    // Prefer passed-in handler if supplied; otherwise use our Supabase service
    const result = onSubmit
      ? await onSubmit(name, imageUrl, active)
      : await createPlayer(name, imageUrl, active);

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
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-base-dark border border-highlight rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30 placeholder-text-muted"
              placeholder="Player name"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="w-full bg-base-dark border border-highlight rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30 placeholder-text-muted"
              placeholder="https://example.com/avatar.png"
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
