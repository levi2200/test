import { useState } from 'react';

interface AuthPageProps {
  mode: 'login' | 'signup';
  onNavigate: (page: string) => void;
  onAuth: (role: string, email: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode, onNavigate, onAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (mode === 'signup' && password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    // Demo logic: admin@rethumb.com gets admin role
    if (email === 'admin@rethumb.com') {
      onAuth('admin', email);
    } else {
      onAuth('free', email);
    }
    setLoading(false);
    onNavigate('generate');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 grid-bg">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <button onClick={() => onNavigate('home')} className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center glow-brand-sm">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="1" y="3" width="16" height="10" rx="2" fill="white" opacity="0.9"/>
                <polygon points="7,5.5 7,10.5 13,8" fill="#FF2D2D"/>
              </svg>
            </div>
            <span className="font-grotesk font-bold text-2xl">Re<span className="text-brand">thumb</span></span>
          </button>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8" style={{ boxShadow: '0 0 60px rgba(0,0,0,0.4)' }}>
          <h2 className="font-grotesk font-bold text-2xl text-white mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-sm text-white/40 mb-7">
            {mode === 'login'
              ? 'Log in to continue generating thumbnails'
              : 'Start with 3 free generations — no card needed'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand/50 focus:bg-brand/5 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand/50 focus:bg-brand/5 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 5C5.24 5 3 6.79 1.6 8c1.4 1.21 3.64 3 6.4 3s5-1.79 6.4-3C12.6 6.79 10.76 5 8 5Zm0 5a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M13.36 3.28 12 4.66A6.45 6.45 0 0 0 8 3C5.24 3 3 4.79 1.6 6L1 6.6l.88.88C2.6 8.25 3.7 9.14 5 9.73l-1.36 1.35.71.71 9.72-9.72-.71-.79ZM8 9a2 2 0 0 1-1.37-.54l.71-.71.66-.66a2 2 0 0 1-.66 1.91ZM8 5c.65 0 1.27.16 1.82.43L8.54 6.72A2 2 0 0 0 8 7a2 2 0 0 0 0 4 2 2 0 0 0 .3-.03l-1.37 1.37A6.5 6.5 0 0 1 8 13C5.24 13 3 11.21 1.6 10L1 9.4l.88-.88.12-.11A9.26 9.26 0 0 0 5 9.73l.71-.71A5.5 5.5 0 0 1 4 8c.53-.4 1.17-.74 1.9-1L7.27 5.63A6.4 6.4 0 0 1 8 5Zm0 0c.65 0 1.27.16 1.82.43l1.36-1.36A6.5 6.5 0 0 0 8 3C5.24 3 3 4.79 1.6 6l.88.88C3.6 5.79 5.66 5 8 5Z"/></svg>
                  )}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand/50 focus:bg-brand/5 transition-all"
                />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M7 4V7M7 10H7.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                {error}
              </div>
            )}

            {/* Demo hint */}
            <div className="px-4 py-3 bg-white/3 border border-white/5 rounded-xl text-xs text-white/30">
              <span className="text-white/50 font-medium">Demo mode:</span> Use any email to sign up as free user.
              Use <span className="text-brand font-mono">admin@rethumb.com</span> for admin access.
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary py-3.5 rounded-xl text-sm font-bold text-white transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'glow-brand'}`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-white/40">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button
              onClick={() => onNavigate(mode === 'login' ? 'signup' : 'login')}
              className="text-sm text-brand hover:underline font-medium"
            >
              {mode === 'login' ? 'Sign up free' : 'Log in'}
            </button>
          </div>
        </div>

        {mode === 'signup' && (
          <p className="text-center text-xs text-white/20 mt-4">
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>
        )}
      </div>
    </div>
  );
};
