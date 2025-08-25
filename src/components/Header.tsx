import React, { useState } from 'react';
import { Crown, LogOut, Settings, Search, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { usePlayerStore } from '../store/playerStore';
import LoginModal from './LoginModal';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const { searchQuery, setSearchQuery } = usePlayerStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };
  
  return (
    <>
      <header className="bg-base-dark py-4 px-6 border-b border-highlight fixed top-0 left-0 right-0 z-[2147483647] shadow-lg backdrop-blur-sm">

        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-3">
              <div className="w-10 h-10 bg-accent-gradient rounded-xl flex items-center justify-center shadow-accent-glow border border-accent-primary/30">
                <Crown size={24} className="text-white" strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="text-2xl font-game font-bold bg-accent-gradient text-transparent bg-clip-text">
              ACD Tier List
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="flex items-center text-accent-primary font-semibold hover:text-accent-secondary transition-colors duration-300">
              <Crown size={18} className="mr-1" />
              Rankings
            </a>
            <a href="#" className="text-text-secondary hover:text-text-primary transition-colors duration-300">
              About
            </a>
            <a href="#" className="text-text-secondary hover:text-text-primary transition-colors duration-300">
              Contact
            </a>
          </nav>
          
          <div className="flex items-center gap-4">
            {/* Desktop Search */}
            <div className="relative w-64 hidden lg:block">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search player..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-panel rounded-full pl-10 pr-10 py-2 text-sm border border-highlight focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30 focus:shadow-accent-glow transition-all duration-300 text-text-primary placeholder-text-muted"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-highlight transition-colors"
            >
              <Search size={20} />
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Admin
                </div>
                <button
                  onClick={logout}
                  className="flex items-center text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/30"
                >
                  <LogOut size={16} className="mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center text-accent-primary hover:text-accent-secondary transition-colors duration-300 px-3 py-1.5 rounded-lg hover:bg-accent-primary/10 border border-transparent hover:border-accent-primary/30"
              >
                <Settings size={16} className="mr-1" />
                Admin
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="lg:hidden mt-4 px-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search player..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-panel rounded-full pl-10 pr-10 py-2 text-sm border border-highlight focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30 focus:shadow-accent-glow transition-all duration-300 text-text-primary placeholder-text-muted"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </header>
      
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
};

export default Header;