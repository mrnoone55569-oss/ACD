import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { X, Crown, User } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const result = await login(email, password);
    
    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Invalid credentials');
    }
    
    setIsLoading(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-panel rounded-2xl p-8 w-full max-w-md relative border border-highlight shadow-2xl shadow-accent-glow">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-accent-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-accent-glow border border-accent-primary/30">
            <Crown size={32} className="text-white" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-text-primary font-game">Admin Access</h2>
          <p className="text-text-secondary text-sm mt-2">Enter your credentials to access admin features</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              <User size={16} className="inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-base-dark border border-highlight rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30 focus:shadow-accent-glow transition-all duration-300 placeholder-text-muted"
              placeholder="Enter your email"
              disabled={isLoading}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              <Crown size={16} className="inline mr-2" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-base-dark border border-highlight rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30 focus:shadow-accent-glow transition-all duration-300 placeholder-text-muted"
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-bold py-3 px-4 rounded-xl transition-all duration-300 ${
              isLoading
                ? 'bg-accent-primary/50 cursor-not-allowed'
                : 'bg-accent-gradient hover:shadow-accent-glow transform hover:scale-[1.02] border border-accent-primary/30 hover:border-accent-primary'
            } text-white shadow-lg`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Authenticating...
              </div>
            ) : (
              'Access Admin Panel'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;