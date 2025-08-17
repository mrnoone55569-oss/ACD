import React from 'react';
import { Crown } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 blur-xl bg-accent-gradient opacity-40 rounded-full animate-pulse"></div>
      <div className="relative flex items-center justify-center h-20 w-20 rounded-2xl bg-accent-gradient border-2 border-accent-primary/50 shadow-accent-glow">
        <Crown size={40} className="text-white" strokeWidth={2} />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent to-white/10"></div>
      </div>
    </div>
  );
};

export default Logo;