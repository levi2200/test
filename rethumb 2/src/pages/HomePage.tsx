import React from 'react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="glass rounded-2xl p-6 hover:border-brand/30 transition-all group">
    <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-all">
      {icon}
    </div>
    <h3 className="font-grotesk font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
  </div>
);

const StepCard = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
  <div className="flex gap-4 items-start">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center">
      <span className="text-brand font-grotesk font-bold text-sm">{num}</span>
    </div>
    <div>
      <h4 className="font-grotesk font-semibold text-white mb-1">{title}</h4>
      <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const AnalysisTag = ({ label }: { label: string }) => (
  <span className="px-3 py-1.5 glass rounded-full text-xs text-white/60 border border-white/5">
    {label}
  </span>
);

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen grid-bg">
      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-brand/8 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8 text-xs font-medium">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full pulse-dot" />
            <span className="text-white/70">AI-Powered Thumbnail Intelligence</span>
          </div>

          <h1 className="font-grotesk font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6">
            Turn Any Thumbnail Into
            <br />
            <span className="gradient-text">Your Thumbnail</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your face. Drop a reference thumbnail. Rethumb analyzes every pixel — composition, lighting, depth, color — and rebuilds it around <span className="text-white/80 font-medium">your identity</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <button
              onClick={() => onNavigate('generate')}
              className="btn-primary px-8 py-4 rounded-xl text-base font-bold text-white glow-brand"
            >
              Start Generating Free
              <span className="ml-2 text-white/60 text-sm font-normal">3 free uses</span>
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className="px-8 py-4 rounded-xl text-base font-medium text-white/70 glass hover:text-white hover:border-white/20 transition-all"
            >
              View Pricing →
            </button>
          </div>

          {/* Hero Visual */}
          <div className="relative max-w-4xl mx-auto">
            <div className="glass rounded-3xl p-2 glow-brand-sm">
              <div className="bg-[#111] rounded-2xl overflow-hidden">
                {/* Fake App UI */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <div className="ml-4 flex-1 bg-white/5 rounded-md h-5 max-w-48" />
                </div>
                <div className="p-6 grid grid-cols-3 gap-4">
                  {/* Upload Section */}
                  <div className="col-span-1 space-y-3">
                    <div className="upload-zone rounded-xl p-4 flex flex-col items-center justify-center gap-2 min-h-[100px]">
                      <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M7 2V9M7 2L4.5 4.5M7 2L9.5 4.5M2 11H12" stroke="#FF2D2D" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <span className="text-xs text-white/40">Face Image</span>
                    </div>
                    <div className="upload-zone rounded-xl p-4 flex flex-col items-center justify-center gap-2 min-h-[100px]" style={{borderColor: 'rgba(255,45,45,0.4)', background: 'rgba(255,45,45,0.05)'}}>
                      <div className="w-8 h-8 rounded-full bg-brand/30 flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <rect x="1" y="2" width="12" height="8" rx="1" stroke="#FF2D2D" strokeWidth="1.5"/>
                          <path d="M4 12H10" stroke="#FF2D2D" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <span className="text-xs text-brand">Reference ✓</span>
                    </div>
                  </div>

                  {/* Analysis */}
                  <div className="col-span-1 space-y-2">
                    {[
                      { label: 'Composition', val: 92 },
                      { label: 'Lighting', val: 87 },
                      { label: 'Color Grade', val: 95 },
                      { label: 'Depth', val: 78 },
                      { label: 'Expression', val: 99 },
                    ].map(({ label, val }) => (
                      <div key={label} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/40">{label}</span>
                          <span className="text-brand">{val}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-brand to-red-400 rounded-full" style={{ width: `${val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Output */}
                  <div className="col-span-1">
                    <div className="aspect-video rounded-xl bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-brand/20 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                      <div className="relative z-10 text-center">
                        <div className="text-brand font-grotesk font-black text-2xl float-anim">DAY 04</div>
                        <div className="text-white/30 text-xs mt-1">Generated</div>
                      </div>
                    </div>
                    <button className="w-full mt-3 btn-primary py-2 rounded-lg text-xs font-semibold text-white">
                      ✦ Generate Thumbnail
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Tags */}
            <div className="absolute -left-8 top-1/3 glass rounded-xl px-3 py-2 text-xs text-white/70 hidden lg:block">
              <span className="text-brand">✓</span> Identity Preserved
            </div>
            <div className="absolute -right-8 top-1/2 glass rounded-xl px-3 py-2 text-xs text-white/70 hidden lg:block">
              <span className="text-green-400">✓</span> CTR Optimized
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Tags */}
      <section className="py-8 overflow-hidden">
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto px-4">
          {[
            'Composition Analysis', 'Face Mapping', 'Lighting Detection',
            'Color Grading', 'Depth of Field', 'Expression Analysis',
            'Text Integration', 'Environment Rebuild', 'Post-Processing Style',
            'Camera Angle', 'Skin Tone Contrast', 'Rim Light Detection'
          ].map(tag => <AnalysisTag key={tag} label={tag} />)}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-grotesk font-bold text-3xl sm:text-4xl mb-4">
              Deep Visual Intelligence
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Rethumb doesn't just copy thumbnails — it deconstructs them into 8 layers of visual data and rebuilds them around your face.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard
              icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="16" height="12" rx="2" stroke="#FF2D2D" strokeWidth="1.5"/><circle cx="10" cy="8" r="3" stroke="#FF2D2D" strokeWidth="1.5"/><path d="M2 16H18" stroke="#FF2D2D" strokeWidth="1.5" strokeLinecap="round"/></svg>}
              title="Face Preservation"
              desc="Your facial structure, skin tone, and expression are locked in — never altered across any generated scene."
            />
            <FeatureCard
              icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="#FF2D2D" strokeWidth="1.5"/><path d="M10 3V10L14 12" stroke="#FF2D2D" strokeWidth="1.5" strokeLinecap="round"/></svg>}
              title="8-Layer Analysis"
              desc="Composition, lighting, color, depth, expression, text, environment, and post-processing — all extracted automatically."
            />
            <FeatureCard
              icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10H17M10 3L17 10L10 17" stroke="#FF2D2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              title="Smart Prompts"
              desc="Every analysis output is converted into a precision prompt engineered for maximum accuracy in AI image generation."
            />
            <FeatureCard
              icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 10L8.5 13.5L15 7" stroke="#FF2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="10" cy="10" r="7" stroke="#FF2D2D" strokeWidth="1.5"/></svg>}
              title="CTR Optimized"
              desc="Every output is designed to be visually aggressive, high-contrast, and click-worthy on YouTube's crowded feed."
            />
            <FeatureCard
              icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="5" width="14" height="10" rx="1.5" stroke="#FF2D2D" strokeWidth="1.5"/><path d="M8 5V3.5C8 3.22 8.22 3 8.5 3H11.5C11.78 3 12 3.22 12 3.5V5" stroke="#FF2D2D" strokeWidth="1.5"/></svg>}
              title="Physical Text"
              desc="Your custom text (Day 04, etc.) is embedded as a real object in the scene — not a flat overlay — with shadows and depth."
            />
            <FeatureCard
              icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L12.4 7.5H18L13.5 11L15.3 17L10 13.5L4.7 17L6.5 11L2 7.5H7.6L10 2Z" stroke="#FF2D2D" strokeWidth="1.5" strokeLinejoin="round"/></svg>}
              title="Style Matching"
              desc="Color grade, bokeh depth, vignette, and cinematic LUT styles are detected and replicated with precision."
            />
            <FeatureCard
              icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 17L7 13M17 3L13 7M3 3L7 7M17 17L13 13" stroke="#FF2D2D" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="10" r="3" stroke="#FF2D2D" strokeWidth="1.5"/></svg>}
              title="Lighting Rebuild"
              desc="Direction, intensity, rim separation, and color temperature are measured and reproduced in the new scene."
            />
            <FeatureCard
              icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 14L8 10L11 13L14 9L17 12" stroke="#FF2D2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="3" width="14" height="14" rx="2" stroke="#FF2D2D" strokeWidth="1.5"/></svg>}
              title="Role-Based Access"
              desc="Free, Pro, Partner, and Admin roles with secure server-side enforcement — no tricks, no client-side bypasses."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-4 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-grotesk font-bold text-3xl sm:text-4xl mb-4">
                From Reference to<br /><span className="gradient-text">Ready in Seconds</span>
              </h2>
              <p className="text-white/50 mb-10">
                Rethumb handles the heavy lifting — deep analysis, prompt engineering, and identity preservation — so you get a studio-grade thumbnail without touching Photoshop.
              </p>
              <div className="space-y-6">
                <StepCard num="1" title="Upload Your Face" desc="Drop in a clear photo of your face. This becomes your locked identity — preserved in every single output." />
                <StepCard num="2" title="Add a Reference Thumbnail" desc="Found a thumbnail style you love? Upload it. Our engine breaks it into 8 visual layers automatically." />
                <StepCard num="3" title="Set Your Text & Style" desc='Enter your custom text (e.g., "Day 04") and select or adjust the scene style to match your channel.' />
                <StepCard num="4" title="Generate & Download" desc="Click generate. Receive a precision-engineered prompt and a rendered thumbnail image, ready to upload." />
              </div>
            </div>

            {/* Visual Side */}
            <div className="glass rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-brand rounded-full pulse-dot" />
                <span className="text-sm text-white/60 font-medium">Analysis in Progress</span>
              </div>

              {[
                { label: 'Composition Analysis', status: 'complete', detail: 'Subject centered · Eye-line upper third · Chest-up framing' },
                { label: 'Lighting Analysis', status: 'complete', detail: 'Top-left source · Hard shadow · Warm highlights · Rim separation' },
                { label: 'Color Grading', status: 'complete', detail: 'Punchy contrast · Red-brown shadows · Golden highlights' },
                { label: 'Depth & Lens', status: 'complete', detail: 'Shallow DOF · Heavy bokeh · 35mm simulation' },
                { label: 'Face Mapping', status: 'active', detail: 'Jawline · Cheekbones · Skin tone · Expression detection...' },
                { label: 'Prompt Generation', status: 'pending', detail: 'Waiting for analysis...' },
              ].map(({ label, status, detail }) => (
                <div key={label} className={`rounded-xl p-4 transition-all ${
                  status === 'complete' ? 'glass border-green-500/20' :
                  status === 'active' ? 'bg-brand/5 border border-brand/30' :
                  'bg-white/2 border border-white/5 opacity-50'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      status === 'complete' ? 'bg-green-500/20' :
                      status === 'active' ? 'bg-brand/20' : 'bg-white/10'
                    }`}>
                      {status === 'complete' && <span className="text-green-400 text-[8px]">✓</span>}
                      {status === 'active' && <div className="w-1.5 h-1.5 bg-brand rounded-full pulse-dot" />}
                      {status === 'pending' && <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />}
                    </div>
                    <span className={`text-xs font-semibold ${
                      status === 'complete' ? 'text-white/80' :
                      status === 'active' ? 'text-brand' : 'text-white/30'
                    }`}>{label}</span>
                  </div>
                  <p className={`text-xs ml-6 ${status === 'pending' ? 'text-white/20' : 'text-white/40'}`}>{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-grotesk font-bold text-3xl mb-4">Creators Love Rethumb</h2>
            <p className="text-white/50">From daily vloggers to viral channels — the results speak.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'Marcus D.', handle: '@marcusdaily', sub: '420K subs', quote: 'My CTR went from 4.2% to 7.8% in 2 weeks. Rethumb nailed the exact lighting style I was going for.', rating: 5 },
              { name: 'Priya S.', handle: '@priyatech', sub: '180K subs', quote: "I uploaded one reference thumbnail and it reconstructed the entire vibe — color grade, depth, everything. Insane.", rating: 5 },
              { name: 'Jake R.', handle: '@jakebuilds', sub: '92K subs', quote: "The face preservation is real. Every thumbnail looks like ME, not some AI-generated stranger.", rating: 5 },
            ].map(({ name, handle, sub, quote, rating }) => (
              <div key={name} className="glass rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#FF2D2D"><path d="M7 1L8.5 4.8H12.5L9.3 7.2L10.5 11L7 8.7L3.5 11L4.7 7.2L1.5 4.8H5.5L7 1Z"/></svg>
                  ))}
                </div>
                <p className="text-sm text-white/70 leading-relaxed mb-4">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand/30 to-brand/10 border border-brand/30 flex items-center justify-center text-xs font-bold text-brand">
                    {name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{name}</div>
                    <div className="text-xs text-white/40">{handle} · {sub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent" />
            <div className="relative z-10">
              <h2 className="font-grotesk font-bold text-3xl sm:text-4xl mb-4">
                Start with 3 Free Generations
              </h2>
              <p className="text-white/50 mb-8">
                No credit card. No commitment. Just upload your face and a reference — and watch the magic happen.
              </p>
              <button
                onClick={() => onNavigate('signup')}
                className="btn-primary px-10 py-4 rounded-xl text-base font-bold text-white glow-brand"
              >
                Create Free Account →
              </button>
              <p className="mt-4 text-xs text-white/30">Then $2/month for unlimited. Cancel anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand rounded-md flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="2" width="10" height="6.5" rx="1" fill="white" opacity="0.9"/>
                <polygon points="4.5,3.5 4.5,7.5 8.5,5.5" fill="#FF2D2D"/>
              </svg>
            </div>
            <span className="font-grotesk font-semibold text-sm">Re<span className="text-brand">thumb</span></span>
          </div>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <span>© 2025 Rethumb</span>
            <button onClick={() => onNavigate('pricing')} className="hover:text-white/60 transition-colors">Pricing</button>
            <span className="hover:text-white/60 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
