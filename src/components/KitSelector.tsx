import React from 'react';
import { Crown, Sword, Axe, Diamond, Heart, TreePine, Gem, FlaskRound, AlignJustify, ShieldX } from 'lucide-react';
import { KITS } from '../config/kits';
import { usePlayerStore } from '../store/playerStore';
import { getKitIcon } from '../config/kits';
import { KitType } from '../types';

const KitSelector: React.FC = () => {
  const { activeKit, setActiveKit } = usePlayerStore();
  
  return (
    <div className="p-6 bg-panel-gradient rounded-xl mb-6 overflow-x-auto border border-highlight shadow-lg shadow-accent-glow/20">
      <div className="flex space-x-3 min-w-max">
        <button
          className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center font-semibold ${
            activeKit === 'overall'
              ? 'bg-accent-gradient text-white shadow-accent-glow border border-accent-primary'
              : 'bg-base-dark hover:bg-highlight text-text-secondary hover:text-text-primary border border-highlight hover:border-accent-primary/50'
          }`}
          onClick={() => setActiveKit('overall' as KitType)}
        >
          <Crown size={18} className="mr-2" />
          <span>Overall</span>
        </button>
        
        {KITS.map(kit => {
          const Icon = getKitIcon(kit.id);
          const isActive = activeKit === kit.id;
          
          return (
            <button
              key={kit.id}
              className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center font-semibold ${
                isActive 
                  ? 'bg-accent-gradient text-white shadow-accent-glow border border-accent-primary'
                  : 'bg-base-dark hover:bg-highlight text-text-secondary hover:text-text-primary border border-highlight hover:border-accent-primary/50'
              }`}
              onClick={() => setActiveKit(kit.id as KitType)}
            >
              <Icon size={18} className="mr-2" />
              <span>{kit.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default KitSelector;