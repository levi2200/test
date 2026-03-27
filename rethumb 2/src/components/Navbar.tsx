import { useState, useEffect } from 'react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: string | null;
  freeUsesLeft: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, userRole, freeUsesLeft }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-dark border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center glow-brand-sm group-hover:glow-brand transition-all">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="3" width="14" height="9" rx="1.5" fill="white" opacity="0.9"/>
                <polygon points="6,5.5 6,9.5 11,7.5" fill="#FF2D2D"/>
              </svg>
            </div>
            <span className="font-grotesk font-700 text-xl tracking-tight">
              Re<span className="text-brand">thumb</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {['home', 'generate', 'pricing'].map((page) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  currentPage === page
                    ? 'text-white bg-white/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {page}
              </button>
            ))}
            {userRole === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === 'admin'
                    ? 'text-brand bg-brand/10'
                    : 'text-white/40 hover:text-brand hover:bg-brand/5'
                }`}
              >
                Admin
              </button>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {userRole === 'free' && (
              <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full text-xs">
                <div className={`w-1.5 h-1.5 rounded-full ${freeUsesLeft > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-white/60">
                  {freeUsesLeft > 0 ? `${freeUsesLeft} free left` : 'Trial ended'}
                </span>
              </div>
            )}
            {userRole === 'pro' && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-brand/10 border border-brand/30 rounded-full text-xs">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1L6.12 3.59L9 3.91L7 5.83L7.62 8.7L5 7.15L2.38 8.7L3 5.83L1 3.91L3.88 3.59L5 1Z" fill="#FF2D2D"/>
                </svg>
                <span className="text-brand font-medium">Pro</span>
              </div>
            )}
            {userRole ? (
              <button
                onClick={() => onNavigate('generate')}
                className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold text-white"
              >
                Generate
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold text-white"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white/70 hover:text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              {menuOpen
                ? <path fillRule="evenodd" clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                : <path fillRule="evenodd" clipRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 4a1 1 0 100 2h12a1 1 0 100-2H4z" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass-dark border-t border-white/5 px-4 py-4 space-y-1">
          {['home', 'generate', 'pricing'].map((page) => (
            <button
              key={page}
              onClick={() => { onNavigate(page); setMenuOpen(false); }}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                currentPage === page ? 'text-white bg-white/10' : 'text-white/60 hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            {!userRole && (
              <>
                <button onClick={() => { onNavigate('login'); setMenuOpen(false); }} className="w-full px-4 py-2 text-sm text-white/70 hover:text-white border border-white/10 rounded-lg">Log in</button>
                <button onClick={() => { onNavigate('signup'); setMenuOpen(false); }} className="w-full btn-primary px-4 py-2 rounded-lg text-sm font-semibold text-white">Get Started</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
