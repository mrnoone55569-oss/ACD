import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';

const ResetButton: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { resetAllRankings } = usePlayerStore();
  
  const handleReset = () => {
    resetAllRankings();
    setShowConfirm(false);
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
      >
        <RotateCcw size={16} className="mr-2" />
        Reset All Rankings
      </button>
      
      {showConfirm && (
        <div className="absolute right-0 top-12 z-20 bg-darker border border-red-500 rounded-lg p-4 w-64 shadow-lg">
          <p className="text-sm mb-3">Are you sure you want to reset all rankings? This cannot be undone.</p>
          <div className="flex justify-between">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded text-sm"
            >
              Reset All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetButton;