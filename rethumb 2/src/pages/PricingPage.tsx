import React from 'react'; // eslint-disable-line @typescript-eslint/no-unused-vars

interface PricingPageProps {
  onNavigate: (page: string) => void;
  userRole: string | null;
}

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 mt-0.5">
    <circle cx="7" cy="7" r="6" fill="#FF2D2D" fillOpacity="0.15"/>
    <path d="M4 7L6.5 9.5L10 5" stroke="#FF2D2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const X = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 mt-0.5">
    <circle cx="7" cy="7" r="6" fill="rgba(255,255,255,0.05)"/>
    <path d="M5 5L9 9M9 5L5 9" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate, userRole }) => {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 grid-bg">
      {/* Glow */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-brand/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6 text-xs font-medium text-white/60">
            <span className="text-brand">✦</span> Simple, transparent pricing
          </div>
          <h1 className="font-grotesk font-bold text-4xl sm:text-5xl mb-4">
            Pricing That Makes Sense
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Start free. Go unlimited for the price of a coffee.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {/* Free Plan */}
          <div className="glass rounded-2xl p-7 flex flex-col">
            <div className="mb-6">
              <div className="text-xs text-white/40 font-medium uppercase tracking-widest mb-2">Free Trial</div>
              <div className="flex items-end gap-1 mb-1">
                <span className="font-grotesk font-bold text-4xl text-white">$0</span>
              </div>
              <p className="text-xs text-white/40">No credit card required</p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {[
                { label: '3 thumbnail generations', ok: true },
                { label: 'Full 8-layer analysis', ok: true },
                { label: 'Prompt generation', ok: true },
                { label: 'Style selection', ok: true },
                { label: 'Unlimited generations', ok: false },
                { label: 'Priority processing', ok: false },
                { label: 'Admin dashboard', ok: false },
              ].map(({ label, ok }) => (
                <li key={label} className="flex items-start gap-2.5">
                  {ok ? <Check /> : <X />}
                  <span className={`text-sm ${ok ? 'text-white/70' : 'text-white/25'}`}>{label}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onNavigate(userRole ? 'generate' : 'signup')}
              className="w-full py-3 rounded-xl text-sm font-semibold border border-white/10 text-white/70 hover:border-white/25 hover:text-white transition-all"
            >
              {userRole ? 'Go to Generator' : 'Start Free'}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl p-7 flex flex-col" style={{
            background: 'linear-gradient(135deg, rgba(255,45,45,0.12), rgba(255,45,45,0.04))',
            border: '1px solid rgba(255,45,45,0.4)',
            boxShadow: '0 0 40px rgba(255,45,45,0.15), inset 0 1px 0 rgba(255,255,255,0.08)'
          }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 bg-brand rounded-full text-xs font-bold text-white">MOST POPULAR</span>
            </div>

            <div className="mb-6 mt-2">
              <div className="text-xs text-brand font-medium uppercase tracking-widest mb-2">Pro</div>
              <div className="flex items-end gap-1 mb-1">
                <span className="font-grotesk font-bold text-4xl text-white">$2</span>
                <span className="text-white/50 text-sm mb-1">/month</span>
              </div>
              <p className="text-xs text-white/40">Billed monthly via PayPal · Cancel anytime</p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {[
                { label: 'Unlimited generations', ok: true },
                { label: 'Full 8-layer analysis', ok: true },
                { label: 'Precision prompt generation', ok: true },
                { label: 'All style options', ok: true },
                { label: 'Priority processing', ok: true },
                { label: 'Download generated images', ok: true },
                { label: 'Admin dashboard', ok: false },
              ].map(({ label, ok }) => (
                <li key={label} className="flex items-start gap-2.5">
                  {ok ? <Check /> : <X />}
                  <span className={`text-sm ${ok ? 'text-white/80' : 'text-white/25'}`}>{label}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                // In production this would go to PayPal subscription link
                onNavigate(userRole ? 'generate' : 'signup');
              }}
              className="w-full btn-primary py-3.5 rounded-xl text-sm font-bold text-white glow-brand"
            >
              {userRole === 'pro' ? '✓ Current Plan' : 'Upgrade to Pro →'}
            </button>
            <p className="text-center text-[10px] text-white/30 mt-3">Powered by PayPal · Secure webhook verification</p>
          </div>

          {/* Partner Plan */}
          <div className="glass rounded-2xl p-7 flex flex-col border-white/8">
            <div className="mb-6">
              <div className="text-xs text-white/40 font-medium uppercase tracking-widest mb-2">Partner</div>
              <div className="flex items-end gap-1 mb-1">
                <span className="font-grotesk font-bold text-4xl text-white">Free</span>
              </div>
              <p className="text-xs text-white/40">Manually assigned by admin</p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {[
                { label: 'Unlimited generations', ok: true },
                { label: 'Full 8-layer analysis', ok: true },
                { label: 'All style options', ok: true },
                { label: 'Priority processing', ok: true },
                { label: 'Download generated images', ok: true },
                { label: 'Partner badge', ok: true },
                { label: 'Admin dashboard', ok: false },
              ].map(({ label, ok }) => (
                <li key={label} className="flex items-start gap-2.5">
                  {ok ? <Check /> : <X />}
                  <span className={`text-sm ${ok ? 'text-white/70' : 'text-white/25'}`}>{label}</span>
                </li>
              ))}
            </ul>

            <button
              className="w-full py-3 rounded-xl text-sm font-semibold border border-white/10 text-white/40 cursor-not-allowed"
              disabled
            >
              By Invite Only
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-grotesk font-bold text-2xl text-center mb-8">Frequently Asked</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How does the free trial work?',
                a: 'Every new account gets 3 free thumbnail generations with full access to the 8-layer analysis and prompt engine. No credit card needed.'
              },
              {
                q: 'How is payment processed?',
                a: 'We use PayPal subscriptions. After payment, PayPal sends a verified webhook to our server, which upgrades your account to Pro. No manual work required.'
              },
              {
                q: 'What is face preservation?',
                a: 'Rethumb locks in your facial geometry — jawline, cheekbones, eye spacing, skin tone — and ensures it\'s carried into every generated thumbnail exactly as-is.'
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Cancel your PayPal subscription at any time. Your Pro access continues until the end of the billing period.'
              },
              {
                q: 'What AI models are used?',
                a: 'Rethumb connects to external image generation APIs (like Stable Diffusion or comparable services) to render the final thumbnail based on the precision prompt.'
              },
              {
                q: 'What is the Partner role?',
                a: 'Partners are granted unlimited access manually by an admin — typically for collaborators, testers, or affiliate creators. It cannot be purchased.'
              },
            ].map(({ q, a }) => (
              <div key={q} className="glass rounded-xl p-5">
                <h4 className="font-grotesk font-semibold text-white text-sm mb-2">{q}</h4>
                <p className="text-sm text-white/50 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Strip */}
        <div className="mt-16 text-center">
          <p className="text-white/40 text-sm mb-4">Ready to 2x your click-through rate?</p>
          <button
            onClick={() => onNavigate(userRole ? 'generate' : 'signup')}
            className="btn-primary px-8 py-4 rounded-xl text-base font-bold text-white glow-brand"
          >
            {userRole ? 'Start Generating →' : 'Create Free Account →'}
          </button>
        </div>
      </div>
    </div>
  );
};
